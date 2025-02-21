import { ApplicationError, getRelative, logger }from '../common/index.js'
import dbInitPromise from '../database/initialize.js'
import userStorageServices from './userStorageServices.js';
const { Image } = await dbInitPromise;

async function createImages(files, userId = null) 
{
    const imageDatas = files.map( file => {
        if (!isImage(file)) throw new ApplicationError('File is not an Image', 400);
        const rel = getRelative(file.path);
        return { path: rel };
    });
    const imageModels = await Image.bulkCreate(imageDatas);

    if(userId)
    {
        await userStorageServices.trackUsedFiles(files, userId);
    }else{
        logger.info(`Guest Creates Untracked Image: ${JSON.stringify(imageModels)}`)
    }
    return imageModels.map( model => model.toJSON() );;
}
async function createImagesKeepInvalids(fileArray, userId)
{
    const validFiles = filterInvalids(fileArray);
    const images = await createImages(validFiles, userId);
    return fileArray.map( file => file ? images.shift() : file );
}

async function deleteImages(imageIds, userId)
{
    await deleteImageFilesOnly(imageIds, userId);
    await Image.destroy({where: { id: imageIds } })
}

async function deleteImageFilesOnly(imageIds, userId)
{
    const images = await Image.findAll({ where: { id: imageIds }, raw: true })
    const relPaths = images.map( img => img.path);
    await userStorageServices.unlinkUnused(relPaths, userId);
}

function filterInvalids(files)
{
    return files.filter( file => {
        return file ? true : false;
    })
}
function isImage(file)
{
    return file.mimetype.startsWith('image/');
}

function include(level)
{
    switch (level) {
        case 'serve':
            return { model: Image, attributes: ['id', 'path']};
        default:
                return { model: Image };
    }
    
}

export default { 
    createImages, 
    createImagesKeepInvalids, 
    deleteImages, 
    deleteImageFilesOnly, 
    include 
};