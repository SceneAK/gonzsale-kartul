import { variantServices } from '../services/index.js';

const fetchVariant = async (req, res) => {
    const {id} = req.params;
    res.json(await variantServices.fetchVariant(id));
}

const createVariants = async (req, res) => {
    const {productId} = req.params;
    const result = await variantServices.createVariants(productId, req.body, req.authJwt.storeId);
    res.json(result || {});
}

const editVariant = async (req, res) => {
    const {id} = req.params;
    const result = await variantServices.editVariant(id, req.body, req.authJwt.storeId);
    res.json(result || {});
}

const setDefault = async (req, res) => {
    const {id} = req.params;
    const result = await variantServices.setDefault(id, req.authJwt.storeId);
    res.json(result || {});
}

const deleteVariant = async (req, res) => {
    const {id} = req.params;
    const result = await variantServices.deleteVariant(id, req.authJwt.storeId);
    res.json(result || {});
}

export default {
    fetchVariant,
    createVariants,
    editVariant,
    setDefault,
    deleteVariant
};