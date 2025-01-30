import ApplicationError from '../common/errors.js';
import initializePromise from '../database/initialize.js';
import orderItemServices from './orderItemServices.js';
import storeServices from './storeServices.js';
import transactionServices from './transactionServices.js';
import userServices from './userServices.js';
const { Order } = await initializePromise;

const ITEMS_AND_TRANSAC = [
    {...transactionServices.include('serve')}, 
    {...orderItemServices.include('serveWithProduct')},
];
const ATTRIBUTES = ['id', 'storeId', 'customerId', 'createdAt'];

async function fetchOrderIncludeAll(id) 
{
    const orderModel = await _fetchOrder(id, {
        include: [...ITEMS_AND_TRANSAC, userServices.include('contacts')],
        attributes: ATTRIBUTES
    });
    orderModel.total = await calculateTotal(orderModel.OrderItems);
    return orderModel.toJSON();
}
async function fetchOrder(id)
{   
    return (await _fetchOrder(id, { attributes: ATTRIBUTES } )).toJSON();
}
async function _fetchOrder(id, options)
{
    const orderModel = await Order.findByPk(id, options);
    if(!orderModel) throw new ApplicationError('Order not found', 404);
    return orderModel;
}

async function fetchIncomingOrders(storeOwnerUserId)
{
    const storeId = await storeServices.fetchStoreIdOfUser(storeOwnerUserId);
    const orders = await Order.findAll({ 
        where: { storeId },
        include: userServices.include('contacts'),
        attributes: ATTRIBUTES
    });
    return orders.map(order => order.toJSON());
}

async function fetchOrders(customerId)
{
    const orders = await Order.findAll({ 
        where: { customerId }, 
        include: [...ITEMS_AND_TRANSAC, storeServices.include('serveName')],
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
        await orderItemServices.create(orderItems);
    })
    return orderItems;
}

async function calculateOrderTotal(orderId)
{
    const orderItems = await orderItemServices.fetchOrderItems(orderId);
    return calculateTotal(orderItems);
}
function calculateTotal(orderItems)
{
    let total = 0;
    for (const item of orderItems) {
        total += item.quantity * item.unitPrice;
    }
    return total;
}

function include(level)
{
    switch (level) {
        case 'serve':
            return {
                model: Order,
                attributes: ATTRIBUTES
            }
        default:
            return { model: Order }
    }
}

export default {
    fetchOrderIncludeAll,
    fetchOrder,
    fetchOrders,
    fetchIncomingOrders,
    createOrder,
    calculateOrderTotal,
    include
}