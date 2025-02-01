import {orderItemServices} from '../services/index.js';

const updateStatus = async (req, res) => {
    const {id} = req.params;
    await orderItemServices.updateStatus(id, req.body.status, req.decodedAuthToken.id);
    return res.json({result: 'updated'});
}

const updateStatusByProduct = async (req, res) => {
    const {productId} = req.params;
    await orderItemServices.updateStatusesByProduct(productId, req.body.status, req.decodedAuthToken.id);
    return res.json({result: 'updated'});
}

export default {updateStatus, updateStatusByProduct}