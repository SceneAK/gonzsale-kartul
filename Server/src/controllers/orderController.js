import { orderServices, userServices } from '../services/index.js';
import { convertAllPathsToURLs } from '../common/pathToURLConverter.js';

const fetchOrder = async (req, res) => {
    const {id} = req.params;
    const result = await orderServices.fetchOrderIncludeAll(id);
    convertAllPathsToURLs(req.protocol, req.hostname, result);
    res.json(result);
}

const fetchIncomingOrders = async (req, res) => {
    res.json(await orderServices.fetchIncomingOrders(req.decodedAuthToken.id, req.query?.page));
}

const fetchOrders = async (req, res) => {
    res.json(await orderServices.fetchOrders(req.decodedAuthToken.id, req.query?.page));
};

const createOrder = async(req, res) => {
    let {customerDetails, OrderItems} = req.body;
    if(req.decodedAuthToken)
    {
        customerDetails = await fetchAsCustomerInfo(req.decodedAuthToken.id);
    }
    const result = await orderServices.createOrder(OrderItems, customerDetails)
    res.json( result );
}

async function fetchAsCustomerInfo(userId)
{
    const user = await userServices.fetchUser(userId);
    return {
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: user.phone,
        customerId: user.id
    }
}

export default {fetchOrder, fetchOrders, fetchIncomingOrders, createOrder}