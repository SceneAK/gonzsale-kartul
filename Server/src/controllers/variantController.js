import { variantServices } from '../services/index.js';

const fetchVariant = async (req, res) => {
    const {id} = req.params;
    res.json(await variantServices.fetchVariant(id));
}

const createVariant = async (req, res) => {
    const {productId} = req.params;
    const result = await variantServices.createVariant(productId, req.body, req.decodedAuthToken.storeId);
    res.json(result || {});
}

const editVariant = async (req, res) => {
    const {id} = req.params;
    const result = await variantServices.editVariant(id, req.body, req.decodedAuthToken.storeId);
    res.json(result || {});
}

const setDefault = async (req, res) => {
    const {id} = req.params;
    const result = await variantServices.setDefault(id, req.decodedAuthToken.storeId);
    res.json(result || {});
}

const deleteVariant = async (req, res) => {
    const {id} = req.params;
    const result = await variantServices.deleteVariant(id, req.decodedAuthToken.storeId);
    res.json(result || {});
}

export default {
    fetchVariant,
    createVariant,
    editVariant,
    setDefault,
    deleteVariant
};