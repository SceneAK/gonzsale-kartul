import { productImageServices, storeServices} from '../services/index.js';

const createProductImage = async (req, res) => {
    const {productId} = req.params;
    const result = await productImageServices.createProductImages(req.files, productId, req.authJwt);
    res.json(result || {});
}
const deleteProductImage = async (req, res) => {
    const {id} = req.params;
    const result = await productImageServices.deleteImage(id, req.authJwt);
    res.json(result || {});
}

export default {
    createProductImage,
    deleteProductImage
};