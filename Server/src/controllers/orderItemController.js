import {orderItemServices} from '../services/index.js';

const updateStatus = async (req, res) => {
    const {id, status} = req.params;

    const result = await orderItemServices.updateStatus(id, status, req.authJwt.storeId);
    return res.json(result || {});
}

const bulkUpdateStatus = async (req, res) => {
    const {status} = req.params;

    const result = await orderItemServices.bulkUpdateStatus(req.query, status, req.authJwt.storeId);
    return res.json(result || {});
}

export default {updateStatus, bulkUpdateStatus}