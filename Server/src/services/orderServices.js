import baseOrderServices from './baseOrderServices.js';
import orderItemServices from './orderItemServices.js';
import storeServices from './storeServices.js';
import transactionServices from './transactionServices.js';
import variantServices from './variantServices.js';
const sequelize = baseOrderServices.sequelize;

const ITEMS_AND_TRANSAC = [
    transactionServices.include('serve'), 
    orderItemServices.include('serve'),
];
const ATTRIBUTES = ['id', 'storeId', 'customerId', 'customerName', 'customerPhone', 'customerEmail', 'createdAt'];
const ORDER = [['createdAt', 'DESC']]

async function fetchOrderIncludeAll(id)
{
    const order = await baseOrderServices.fetchOrder(id, {
        include: ITEMS_AND_TRANSAC,
        attributes: ATTRIBUTES
    });
    orderEnricher.summarizeOrderItems(order);
    return order;
}

async function fetchIncomingOrders(storeId, page = 1, whereOrderItem = {})
{
    let result = await baseOrderServices.fetchAndCountAll(page, { 
        include: [
            transactionServices.include('serve'),
            {...orderItemServices.include('serve'), where: whereOrderItem}
        ],
        where: { storeId },
        attributes: ATTRIBUTES,
        order: ORDER
    });
    
    result.items.forEach(order => orderEnricher.summarizeRemoveOrderItems(order) );

    sortByStatus(result.items);
    return result;
}
function sortByStatus(orders)
{
    const priority = orderItemServices.statusOrder;
    orders.sort((a, b) => priority.indexOf(a.status) - priority.indexOf(b.status));
}

async function fetchOrders(customerId, page = 1)
{
    return await baseOrderServices.fetchAndCountAll(page, { 
        where: { customerId }, 
        include: [...ITEMS_AND_TRANSAC, storeServices.include('serveName')],
        attributes: ATTRIBUTES,
        order: ORDER
    });
};

async function createOrder(orderItems, customerDetails)
{
    const firstVariant = await variantServices.fetchVariantIncludeProduct(orderItems[0].variantId);
    const storeId = firstVariant.Product.storeId;
    
    let order;

    await sequelize.transaction( async transaction => {
        order = await baseOrderServices._createOrder(customerDetails, storeId, {transaction});
        await orderItemServices._createOrderItems(orderItems, order.id, transaction);
    })
    return order;
}

async function calculateOrderTotal(orderId)
{
    const orderItems = await orderItemServices.fetchOrderItems({orderId}, ['quantity', 'unitPrice']);
    return orderEnricher.calculateTotal(orderItems);
}

async function deleteOrder(id, requesterStoreId)
{
    const order = await baseOrderServices.fetchOrder(id);
    baseOrderServices.ensureStoreOwnsOrder(order, requesterStoreId);

    await sequelize.transaction( async t => {
        await orderItemServices._deleteOrderItemsOfOrder(id);
        await baseOrderServices._deleteOrder(id);
    })
}


export default {
    fetchOrderIncludeAll,
    fetchOrders,
    fetchIncomingOrders,
    createOrder,
    deleteOrder,
    calculateOrderTotal
}

class OrderEnricher {
    summarizeRemoveOrderItems(order)
    {
        this.summarizeOrderItems(order);
        delete order.OrderItems;
    }
    summarizeOrderItems(order)
    {
        order.status = this.calculateOverallStatus(order.OrderItems);
        order.total = this.calculateTotal(order.OrderItems);
        order.numberOfItems = order.OrderItems.length;
    }
    calculateTotal(orderItems)
    {
        let total = 0;
        for (const item of orderItems) {
            total += item.quantity * item.unitPrice;
        }
        return total;
    }
    calculateOverallStatus(items)
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
}
const orderEnricher = new OrderEnricher(); 