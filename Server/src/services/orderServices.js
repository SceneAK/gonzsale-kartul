import initializePromise from '../database/initialize.js';
import productServices from './productServices.js';
import storeServices from './storeServices.js';
import userServices from './userServices.js';
const { Order, OrderItem } = await initializePromise;

async function fetchIncomingOrders(decodedAuthToken)
{
    const storeId = storeServices.fetchStoreIdOfUser(decodedAuthToken.id);
    const orders = await Order.scope('withItems').findAll({ where: { storeId },});
    return orders.map(order => order.get());
}

async function fetchOrders(decodedAuthToken)
{
    const orders = await Order.scope('withItems').findAll({ where: { customerId: decodedAuthToken.id } });
    return orders.map(order => order.get());
};


async function placeOrder(orderData, decodedAuthToken)
{
    const { productId } = orderData;
    const product = productServices.fetchProduct(productId);
    if(product.availability == 'UNAVAILABLE') throw new Error("Product Unavailable");
    
    // record transaction 

    // parse orderVariant as obj

    // make the order
}

async function placeOrderGuest(orderData, guestData){
    const {email, name, phone} = guestData;
    const user = userServices.findOrCreateGuest(email, name, phone);

    return await placeOrder(orderData, user);
}

async function updateOrderStatus(orderId, status, decodedAuthToken)
{
    
}


export default {
    fetchOrders,
    fetchIncomingOrders,
    placeOrder, 
    placeOrderGuest, 
    updateOrderStatus
}