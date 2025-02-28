import { env } from '../../initialize.js';
import localStorage from './localStorage.js';
import { logger } from './logger.js';
const USING_GCS = env.USE_GCS == 'true';
let GCS = USING_GCS ? (await import('./GCS.js')).default : null; // dynamically, else it will throw error trying to access bucket credentials

// GCS and Local should be split into two classes.
function buildAccessURL(req, relativePath)
{
    const gcsFilename = relativePath;
    return USING_GCS ? GCS.completePublicURL(gcsFilename) : localStorage.buildAccessURL(req, relativePath);
}

async function saveFile(file, relativePath)
{
    try{
        if(USING_GCS){
            const filename = relativePath;
            await GCS.uploadFile(file, filename);
        }else{
            await localStorage.writeFile(file, relativePath);
        }
    }catch(err){
        logger.error(`could not save file ${file.originalname}: ` + JSON.stringify(err));
    }
}

async function getStat(relativePath)
{
    if(USING_GCS){
        const fileMetadata = await GCS.fetchFileMetadata(relativePath);
        return fileMetadata;
    }else{
        const stat = await localStorage.readStat(relativePath);
        return stat;
    }
}

async function deleteRelativePath(relativePath)
{
    if(USING_GCS){
        const filename = relativePath;
        await GCS.deleteFilename(filename);
    }else{
        await localStorage.unlinkRelativePath(relativePath);
    }
}

export default { USING_GCS, saveFile, deleteRelativePath, getStat, buildAccessURL }