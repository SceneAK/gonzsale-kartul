import { orderServices } from '../services/index.js';
import { convertAllPathsToURLs } from '../common/pathToURLConverter.js';

const fetchOrder = async (req, res) => {
    const {id} = req.param;
    const result = await orderServices.fetchOrder(id);
    convertAllPathsToURLs(req.protocol, req.hostname, result);
    res.json(result);
}

const fetchIncomingOrders = async (req, res) => {
    res.json(await orderServices.fetchIncomingOrders(req.decodedAuthToken.id));
}

const fetchOrders = async (req, res) => {
    res.json(await orderServices.fetchOrders(req.decodedAuthToken.id));
};

const createOrder = async(req, res) => {
    await orderServices.createOrder(req.body.OrderItems, req.decodedAuthToken.id)
    res.json({result: 'created'});
}

const updateOrderStatus = async (req, res) => {
    
}


export default {fetchOrder, fetchOrders, fetchIncomingOrders, createOrder, updateOrderStatus}