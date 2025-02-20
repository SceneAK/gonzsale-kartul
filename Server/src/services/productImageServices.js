import ApplicationError from "../common/errors.js";
import { productImage } from "../controllers/index.js";
import databaseInitializePromise from "../database/initialize.js";
import baseProductServices from "./baseProductServices.js";
import imageServices from "./imageServices.js";
import storeServices from "./storeServices.js";
const { ProductImage } = await databaseInitializePromise;

const MAX_IMAGES = 4;
async function fetchProductImages(productId, option = {})
{
    const models = await ProductImage.findAll({where: {productId}, ...option });
    return models.map( model => model.toJSON());
}
async function fetchProductImage(imageId, options)
{
    const productImage = await ProductImage.findOne({where: {imageId}, ...options});
    if(!productImage) throw new ApplicationError("Product image not found", 404);
    return productImage;
}
async function createProductImages(files, productId, requester)
{
    await baseProductServices.ensureBelongsToStore(productId, requester.storeId);
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
    baseProductServices.ensureProductBelongsToStore(productImage.Product, requester.storeId);

    await ProductImage.sequelize.transaction( async t => {
        await imageServices.deleteImages([imageId], requester.id);
        await ProductImage.destroy({where: {imageId}});
    })
}
async function deleteProductImages(productId, requester)
{
    const productImages = await fetchProductImages(productId, { include: baseProductServices.include()});
    productImages.forEach( prdImg => baseProductServices.ensureProductBelongsToStore(prdImg.Product, requester.storeId) ); 
    const imageIds = productImage.map( prdImg => prdImg.imageId);

    await ProductImage.sequelize.transaction( async t => {
        await imageServices.deleteImages(imageIds, requester.id);
        await ProductImage.destroy({where: {productId}});
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
        attributes: ['priority', 'imageId'],
        include: imageServices.include('serve')
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
    createProductImages, 
    createProductImages, 
    reorderProductImages,  
    deleteImage, 
    deleteProductImages,
    include 
};