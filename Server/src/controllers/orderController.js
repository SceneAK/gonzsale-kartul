import { orderServices, userServices } from '../services/index.js';
import { convertAllPathsToURLs } from '../common/pathToURLConverter.js';
import { productTransform } from './transformer/index.js';

const fetchOrder = async (req, res) => {
    const {id} = req.params;
    const result = await orderServices.fetchOrderIncludeAll(id);
    convertAllPathsToURLs(req.protocol, req.hostname, result);
    res.json(result);
}

const fetchIncomingOrders = async (req, res) => {
    const { page, ...additionalWhere} = req.query ? req.query : {};
    const result = await orderServices.fetchIncomingOrders(req.decodedAuthToken.id, page, additionalWhere)
    result.items.forEach( order => transformOrder(order))
    res.json();
}

const fetchOrders = async (req, res) => {
    const result = await orderServices.fetchOrders(req.decodedAuthToken.id, req.query?.page);
    result.items.forEach( order => transformOrder(order))
    res.json(result);
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

function transformOrder(order)
{
    const product = order.OrderItems?.[0].Product;
    if(product)
    {
        order.OrderItems.forEach( orderItem => {
            productTransform.flattenProductImages(orderItem.Product);
        })
    }
    console.log(order);
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