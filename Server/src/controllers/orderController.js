import { orderServices, storeServices, userServices } from '../services/index.js';
import { convertAllPathsToURLs } from '../common/index.js';
import { productTransform } from './transformer/index.js';

const fetchOrder = async (req, res) => {
    const {id} = req.params;
    const result = await orderServices.fetchOrderIncludeAll(id);
    convertAllPathsToURLs(req, result);
    res.json(result || {});
}

const fetchOrdersForStore = async (req, res) => {
    const { storeId } = req.params;
    const { page, ...whereOrderItems} = req.query ? req.query : {};
    const result = await orderServices.fetchOrdersForStore(storeId, page, whereOrderItems)
    result.items.forEach( order => transformOrder(order))
    res.json(result || {});
}

const fetchOrdersOfUser = async (req, res) => {
    const { userId } = req.params;
    const { page } = req.query ? req.query : {};

    const result = await orderServices.fetchOrdersOfUser(userId, page);
    result.items.forEach( order => transformOrder(order))
    res.json(result || {});
};

const createOrders = async(req, res) => {
    let {customerDetails, Orders} = req.body;
    if(req.authJwt)
    {
        customerDetails = await fetchAsCustomerInfo(req.authJwt.id);
    }
    const result = await orderServices.createOrders(Orders, customerDetails)
    res.json( result );
}

const deleteOrder = async (req, res) => {
    const {id} = req.params;
    
    const result = await orderServices.deleteOrder(id, req.authJwt.storeId);
    res.json(result || {});
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

export default {fetchOrder, fetchOrdersOfUser, fetchOrdersForStore, createOrders, deleteOrder}