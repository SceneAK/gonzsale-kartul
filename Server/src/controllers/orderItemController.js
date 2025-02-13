import {orderItemServices} from '../services/index.js';

const updateStatus = async (req, res) => {
    const {id} = req.params;

    await orderItemServices.updateStatus(id, req.body.status, req.decodedAuthToken.storeId);
    return res.json({result: 'updated'});
}

const updateStatusByVariant = async (req, res) => {
    const {variantId} = req.params;

    await orderItemServices.updateStatusesByVariant(variantId, req.body.status, req.decodedAuthToken.storeId);
    return res.json({result: 'updated'});
}

export default {updateStatus, updateStatusByVariant}