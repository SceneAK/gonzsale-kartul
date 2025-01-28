import databaseInitializePromise from "../database/initialize.js";
import imageServices from "./imageServices.js";
const { ProductImage } = await databaseInitializePromise;

async function fetchProductImages(productId)
{
    const models = await ProductImage.findAll({where: {productId}, include: { model: ProductImage } });
    return models.map( model => model.toJSON());
}
async function createProductImagesAuto(files, productId, userId)
{
    const imageDataMapper = (image, index) => {
        const imageId = image.id;
        return { productId, imageId, priority: index };
    }
    return await _createProductImages(files, productId, userId, imageDataMapper);
}
async function createProductImages(files, priorities, productId, userId)
{
    const imageDataDefinedPriorityMapper = (image, index) => {
        const imageId = image.id;
        const priority = priorities[index];
        return { productId, imageId, priority };
    }
    return await _createProductImages(files, productId, userId, imageDataDefinedPriorityMapper);
}

async function deleteImages(imageIds, userId)
{
    return await imageServices.deleteImages(imageIds, userId);
}

async function reorderProductImages(imageIds, productId)
{
    const imageData = imageIds.map( (imageId, index) => { return {imageId, priority: index, productId}  })
    await ProductImage.bulkCreate(imageData, {updateOnDuplicate: ['priority']})
}

async function _createProductImages(files, productId, userId, imagesToImageDatas)
{
    console.log("ProductImageServices LINE 41")
    const images = await imageServices.createImages(files, userId);
    const imageDatas = images.map(imagesToImageDatas);
    console.log("ProductimageServices LINE 44")
    const productImageModels = await ProductImage.bulkCreate(imageDatas);
    return productImageModels.map( model => model.toJSON());
}

function include(level)
{
    switch (level) {
        case 'serve-image':
            return {
                model: ProductImage,
                attributes: ['priority'],
                include: imageServices.include('serve'),
                separate: true,
                order: [['priority', 'ASC']],
            }
        default:
            return {
                model: ProductImage
            }
    }
}

export default { fetchProductImages, createProductImagesAuto, createProductImages, reorderProductImages,  deleteImages, include };