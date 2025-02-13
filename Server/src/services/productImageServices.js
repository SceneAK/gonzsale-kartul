import ApplicationError from "../common/errors.js";
import { productImage } from "../controllers/index.js";
import databaseInitializePromise from "../database/initialize.js";
import baseProductServices from "./baseProductServices.js";
import imageServices from "./imageServices.js";
import storeServices from "./storeServices.js";
const { ProductImage } = await databaseInitializePromise;

const MAX_IMAGES = 4;
async function fetchProductImages(productId)
{
    const models = await ProductImage.findAll({where: {productId}, include: { model: ProductImage } });
    return models.map( model => model.toJSON());
}
async function fetchProductImage(id, options)
{
    const productImage = await ProductImage.findByPk(id, options);
    if(!productImage) throw new ApplicationError("Product image not found", 404);
    return productImage;
}
async function createProductImages(files, productId, requester)
{
    baseProductServices.ensureBelongsToStore(productId, requester.storeId);
    const existing = await ProductImage.findAll({ where: {productId}, raw: true });
    const lowestPriorityNumber = existing.length > 0 ? getLeastPrioritized(existing) : -1;

    if(existing.length + files.length > MAX_IMAGES) throw new ApplicationError(`Product cannot have more than ${MAX_IMAGES} images`, 400);
    
    const imageDataMapper = (image, index) => {
        const imageId = image.id;
        return { productId, imageId, priority: lowestPriorityNumber + index + 1 };
    }
    return await _createProductImages(files, productId, requester.id, imageDataMapper);
}
function getLeastPrioritized(productImages)
{
    return productImages.reduce( (prev, item, index) => {
        if(index == 0) return item.priority;
        const isLessPrioritized = item.priority > prev;
        return isLessPrioritized ? item.priority : prev;
    }, 0)
}

async function deleteImage(imageId, requester)
{
    const productImage = await fetchProductImage(imageId, { include: baseProductServices.include()});
    await baseProductServices.ensureProductBelongsToStore(productImage.Product, requester.storeId);

    await ProductImage.sequelize.transaction( async t => {
        await imageServices.deleteImages([imageId], requester.id);
        await ProductImage.destroy({where: {imageId}});
    })
}

async function reorderProductImages(imageIds, productId)
{
    const imageData = imageIds.map( (imageId, index) => { return {imageId, priority: index, productId}  })
    await ProductImage.bulkCreate(imageData, {updateOnDuplicate: ['priority']})
}

async function _createProductImages(files, productId, userId, imagesToImageDatas)
{
    let productImages;
    await ProductImage.sequelize.transaction( async t => {
        const images = await imageServices.createImages(files, userId);
        const imageDatas = images.map(imagesToImageDatas);

        const models = await ProductImage.bulkCreate(imageDatas);
        productImages = models.map( model => model.toJSON())
    })
    return productImages;
}

function include(level)
{
    const serve = {
        model: ProductImage,
        attributes: ['priority'],
        include: imageServices.include('serve'),
        separate: true,
        order: [['priority', 'ASC']]
    };
    switch (level) {
        case 'serve':
            return serve;
        case 'serveOne':
            return {...serve, limit: 1};
        default:
            return {
                model: ProductImage
            }
    }
}

export default { 
    fetchProductImages, 
    createProductImages, 
    createProductImages, 
    reorderProductImages,  
    deleteImage, 
    include 
};