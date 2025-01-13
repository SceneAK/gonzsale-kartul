import databaseInitializePromise from "../database/initialize.js";
import imageServices from "./imageServices.js";
const { ProductImage } = await databaseInitializePromise;

async function createProductImages(files, productId) 
{
    const images = await imageServices.createImages(files);
    const imageDatas = images.map( (image, index) => {
        return { productId, imageId: image.id, priority: index };
    });
    console.log(imageDatas);
    const productImageModels = await ProductImage.bulkCreate(imageDatas);
    return productImageModels.map( model => model.get());
}

async function updateProductImages(files, productId)
{
    deleteProductImages(productId);
    return createProductImages(files, productId);
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

export default { createProductImages, updateProductImages, include };