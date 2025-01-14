import databaseInitializePromise from "../database/initialize.js";
import imageServices from "./imageServices.js";
const { ProductImage } = await databaseInitializePromise;

async function createProductImagesAuto(files, productId, userId)
{
    return await _createProductImages(files, productId, userId, imageDataMapper);
}
async function createProductImages(files, priorities, productId, userId)
{
    return await _createProductImages(files, productId, userId, imageDataDefinedPriorityMapper(priorities));
}

async function deleteImages(imageIds, userId)
{
    return imageServices.deleteImages(imageIds, userId);
}

async function _createProductImages(files, productId, userId, imagesToImageDatas)
{
    const images = await imageServices.createImages(files);
    const imageDatas = images.map(imagesToImageDatas);

    const productImageModels = await ProductImage.bulkCreate(imageDatas);
    return productImageModels.map( model => model.toJSON());
}

const imageDataMapper = (image, index) => {
    const imageId = image.id;
    return { productId, imageId, priority: index };
}

const imageDataDefinedPriorityMapper = (priorities) => (image, index) => {
    const imageId = image.id;
    const priority = priorities[index];
    return { productId, imageId, priority };
}

function include(level)
{
    switch (level) {
        case 'serve-image':
            return {
                model: ProductImage,
                attributes: ['priority'],
                include: imageServices.include('serve')
            }
        default:
            return {
                model: ProductImage
            }
    }
}

export default { createProductImagesAuto, createProductImages, deleteImages, include };