import ApplicationError from '../common/errors.js';
import initializePromise from '../database/initialize.js';
import orderItemServices from './orderItemServices.js';
import storeServices from './storeServices.js';
import transactionServices from './transactionServices.js';
import userServices from './userServices.js';
const { Order } = await initializePromise;

const WITH_ITEMS = [
    {...transactionServices.include('serve')}, 
    {...orderItemServices.include('serve')}
];
const ATTRIBUTES = ['id', 'storeId', 'customerId', 'createdAt'];
async function fetchOrder(id) // todo: check if user has association with the order
{
    const order = await Order.findByPk(id, {
        include: WITH_ITEMS,
        attributes: ATTRIBUTES
    });
    
    if(!order) throw new ApplicationError('Order not found', 404);
    return order.toJSON();
    
}
async function fetchIncomingOrders(storeOwnerUserId)
{
    const storeId = await storeServices.fetchStoreIdOfUser(storeOwnerUserId);
    const orders = await Order.findAll({ 
        where: { storeId },
        include: [...WITH_ITEMS, userServices.include('contacts')],
        attributes: ATTRIBUTES
    });
    return orders.map(order => order.toJSON());
}

async function fetchOrders(customerId)
{
    const orders = await Order.findAll({ 
        where: { customerId }, 
        include: [...WITH_ITEMS, storeServices.include('just-name')],
        attributes: ATTRIBUTES
    });
    return orders.map(order => order.toJSON());
};

async function createOrder(orderItems, customerId) // please refactor
{
    await Order.sequelize.transaction( async t => {
        const orderModel = Order.build({customerId});
        const commonStoreId = await orderItemServices.completeAndValidate(orderItems, orderModel.id);
        orderModel.storeId = commonStoreId;
        await orderModel.save();
        await orderItemServices.createOrderItems(orderItems);
    })
    return orderItems;
}

export default {
    fetchOrder,
    fetchOrders,
    fetchIncomingOrders,
    createOrder
}