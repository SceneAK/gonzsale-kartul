import upath from  'upath';
import { promises as fs} from 'fs';
import { PUBLIC_DIR } from '../../initialize.js';
import { logger } from '../common/logger.js';
import dbInitializePromise from '../database/initialize.js'
const { UserStorage } = await dbInitializePromise;

async function getUsed(decodedAuthToken)
{
    const model = await UserStorage.findByPk(decodedAuthToken.id);
    return model ? model.get('usedStorage') : 0;
}
async function trackUsedFiles(files, decodedAuthToken)
{
    let total = 0;
    files.forEach( file => {
        total += file.size;
    });
    await addToUsed(total, decodedAuthToken.id);
}
async function unlinkUnused(relPaths, decodedAuthToken)
{
    let absSize = 0;
    relPaths.forEach(relPath => {
        const path = upath.join(PUBLIC_DIR, relPath)
        fs.unlink(path, async err => {
            if(!err) 
            {
                const size = (await fs.stat(path)).size;
                absSize += size;
            }
        }).catch( err => logger.error("Updated Unlink Error, ", err.message) );
    });
    await addToUsed(-absSize, decodedAuthToken.id);
}

async function addToUsed(amount, userId)
{
    const userStorageModel = await UserStorage.findByPk(userId);
    if(userStorageModel)
    {
        userStorageModel.increment('usedStorage', {by: amount});
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