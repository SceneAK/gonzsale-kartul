import {orderItemServices} from '../services/index.js';

const updateStatus = async (req, res) => {
    const {id, status} = req.params;

    const result = await orderItemServices.updateStatus(id, status, req.decodedAuthToken.storeId);
    return res.json(result || {});
}

const updateStatusWhere = async (req, res) => {
    const {status} = req.params;

    const result = await orderItemServices.updateStatusWhere(req.query, status, req.decodedAuthToken.storeId);
    return res.json(result || {});
}

export default {updateStatus, updateStatusWhere}