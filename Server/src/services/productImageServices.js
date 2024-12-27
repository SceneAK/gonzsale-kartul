import databaseInitializePromise from "../database/initialize";
import imageServices from "./imageServices";
const { ProductImage } = await databaseInitializePromise;

async function createProductImages(files, productId) 
{
    const images = await imageServices.createImages(files);
    const imageDatas = images.map( (image, index) => {
        return { productId, imageId: image.id, prioirity: index };
    });

    const productImageModels = await ProductImage.bulkCreate(imageDatas);
    return productImageModels.map( model => model.get());
}

async function updateProductImages(files, productId)
{
    await ProductImage.destroy({ where: { productId } });
    return createProductImages(files, productId);
}

export default { createProductImages, updateProductImages };