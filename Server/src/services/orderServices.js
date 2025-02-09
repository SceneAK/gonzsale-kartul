import ApplicationError from '../common/errors.js';
import initializePromise from '../database/initialize.js';
import orderItemServices from './orderItemServices.js';
import storeServices from './storeServices.js';
import transactionServices from './transactionServices.js';
import { paginationOption, reformatFindCountAll } from '../common/pagination.js';
const { Order } = await initializePromise;

const ITEMS_AND_TRANSAC = [
    transactionServices.include('serve'), 
    orderItemServices.include('serveWithProduct'),
];
const ATTRIBUTES = ['id', 'storeId', 'customerId', 'customerName', 'customerPhone', 'customerEmail', 'createdAt'];
const order = [['createdAt', 'DESC']]

async function fetchOrderIncludeAll(id)
{
    const orderModel = await _fetchOrder(id, {
        include: ITEMS_AND_TRANSAC,
        attributes: ATTRIBUTES
    });
    const order = orderModel.toJSON();
    includeAditionalFields(order);
    return order;
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

async function fetchIncomingOrders(storeOwnerUserId, page = 1, where = {})
{
    const storeId = await storeServices.fetchStoreIdOfUser(storeOwnerUserId);

    let result = await Order.findAndCountAll({ 
        include: [
            transactionServices.include('serve'),
            orderItemServices.include('serve')
        ],
        where: { storeId, ...where },
        attributes: ATTRIBUTES,
        order,
        ...paginationOption(page, 10)
    });
    result = reformatFindCountAll(result, page).itemsToJSON();
    
    result.items.forEach(order => {
        includeAditionalFields(order);
        delete order.OrderItems;
    });
    sortByStatus(result.items);
    return result;
}
function includeAditionalFields(order)
{
    order.status = calculateOverallStatus(order.OrderItems);
    order.total = calculateTotal(order.OrderItems);
    order.numberOfItems = order.OrderItems.length;
}
function sortByStatus(orders)
{
    const priority = orderItemServices.statusOrder;
    orders.sort((a, b) => priority.indexOf(a.status) - priority.indexOf(b.status));
}

async function fetchOrders(customerId, page = 1)
{
    const result = await Order.findAndCountAll({ 
        where: { customerId }, 
        include: [...ITEMS_AND_TRANSAC, storeServices.include('serveName')],
        attributes: ATTRIBUTES,
        order,
        ...paginationOption(page, 10)
    });
    return reformatFindCountAll(result, page).itemsToJSON();
};

async function createOrder(orderItems, customerDetails) // please refactor
{
    let id;
    await Order.sequelize.transaction( async t => {
        const orderModel = Order.build(customerDetails);
        id = orderModel.id;
        
        const commonStoreId = await orderItemServices.completeAndValidate(orderItems, id);
        orderModel.storeId = commonStoreId;
        await orderModel.save();
        await orderItemServices.create(orderItems);
    })
    return id;
}

async function calculateOrderTotal(orderId)
{
    const orderItems = await orderItemServices.fetchOrderItems({orderId}, ['quantity', 'unitPrice']);
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

function calculateOverallStatus(items)
{
    let overallStatus = items[0].status;
    items.some(item => {
        if(item.status != overallStatus) {
            overallStatus = 'MIXED';
            return true;
        }
    });
    return overallStatus;
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
    calculateOverallStatus,
    include
}