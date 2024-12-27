import { getRelative }from '../common/pathUtil.js'
import databaseInitializePromise from '../database/initialize.js'
import userStorageServices from './userStorageServices.js';
const { Image } = await databaseInitializePromise;

async function createImages(files, decodedAuthToken)
{
    const imageDatas = files.map( file => {
        if (!file.mimetype.startsWith('image/')) throw new Error('File is not an Image');

        const relPath = getRelative(file.path);
        return { path: relPath };
    });

    const imageModels = await Image.bulkCreate(imageDatas);
    await userStorageServices.trackUsedFiles(files, decodedAuthToken);
    
    const images = imageModels.map( model => model.get() );
    return images;
}
async function createImagesKeepNull(files, decodedAuthToken)
{
    const validFiles = removeUndefinedKeys(files);
    const images = await createImages(validFiles, decodedAuthToken);

    return files.map( file => file ? images.shift() : file );
}

async function deleteImages(imageIds, decodedAuthToken)
{
    const imageModels = await Image.findAll({ where: { id: imageIds } })

    const ids = imageModels.map(model => model.id);
    await Image.destroy({where: {id: ids} })

    const relPaths = imageModels.map(model => model.path);
    await userStorageServices.unlinkUnused(relPaths, decodedAuthToken);
}

function removeUndefinedKeys(input) {
    return Object.fromEntries(Object.entries(input).filter(([key, value]) => value != undefined));
}

export default { createImages, createImagesKeepNull, deleteImages }