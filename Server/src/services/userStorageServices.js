import { promises as fs} from 'fs';
import { logger, getFull } from '../common/index.js';
import dbInitializePromise from '../database/initialize.js'
const { UserStorage } = await dbInitializePromise;

async function getUsed(userId)
{
    const row = await UserStorage.findByPk(userId, {raw: true});
    return row ? row.usedStorage : 0;
}

async function trackUsedFiles(files, userId)
{
    let total = 0;
    files.forEach( file => total += file.size );
    await addToUsed(total, userId);
}

async function unlinkUnused(relPaths, userId)
{
    let absSize = 0;
    for(const relPath of relPaths){
        const path = getFull(relPath);
        try
        {
            const size = (await fs.stat(path)).size;
            absSize += size;
            
            await fs.unlink(path);
        }catch(err)
        {
            logger.error("Updated Unlink Error, ", err.message);
        }
    }
    await addToUsed(-absSize, userId);
}

async function addToUsed(amount, userId)
{
    const model = await UserStorage.findByPk(userId);
    if(model)
    {
        model.increment('usedStorage', { by: amount });
    }else{
        await UserStorage.create({
            userId,
            userStorage: amount
        })
    }
}

export default {
    getUsed,
    trackUsedFiles,
    unlinkUnused
};