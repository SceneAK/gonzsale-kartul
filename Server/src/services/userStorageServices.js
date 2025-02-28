import { logger } from '../systems/index.js';
import dbInitPromise from '../database/initialize.js'
import upload from '../systems/upload.js';
const { UserStorage } = await dbInitPromise;

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
        try
        {
            const size = (await upload.getStat(relPath)).size;
            absSize += size;

            await upload.deleteRelativePath(relPath);
        }catch(err)
        {
            logger.error(`Error Unlinking ${relPath} : `, JSON.stringify(err));
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