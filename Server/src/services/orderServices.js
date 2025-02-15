import FilterToWhereConverter from '../common/filterToWhere.js';
import { OrderItem } from '../database/models/orderModel.js';
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
async function fetchOrder(id)
{
    return await baseOrderServices.fetchOrder(id);
}

async function fetchIncomingOrders(storeId, page = 1, filter = {})
{
    const orderItemWhere = filterToWhereConverter.convert(filter);
    let result = await baseOrderServices.fetchAndCountAll(page, { 
        include: [
            transactionServices.include('serve'),
            {...orderItemServices.include('serve'), where: orderItemWhere, required: true}
        ],
        where: { storeId },
        attributes: ATTRIBUTES,
        order: ORDER
    });
    
    result.items.forEach(order => orderEnricher.summarizeRemoveOrderItems(order) );

    orderEnricher.sortByStatus(result.items);
    return result;
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
    const orderItems = await orderItemServices.fetchOrderItems(orderId);
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
    fetchOrder,
    fetchOrderIncludeAll,
    fetchOrders,
    fetchIncomingOrders,
    createOrder,
    deleteOrder,
    calculateOrderTotal
}

class OrderEnricher {
    constructor(statusOrder)
    {
        this.statusOrder = statusOrder;
        this.PARTIALLY = "PARTIALLY "
    }
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
        const statuses = items.map(item => item.status);

        const isPartial = this._isPartial(statuses);
        const mostFrequentStatus = this._findMostFrequent(statuses);

        return `${isPartial ? this.PARTIALLY:""}${mostFrequentStatus}`;
    }
    _isTerminal(statuses)
    {
        return !statuses.some(status => {
            if(status != "COMPLETED") {
                return true;
            }
        });
    }
    _isPartial(statuses)
    {
        return statuses.some(status => {
            if(status != statuses[0]) {
                return true;
            }
        });
    }
    _findMostFrequent(arr) {
        const frequencyMap = {};
        let maxCount = 0;
        let mostFrequent = null;
        
        for (const item of arr) {
            frequencyMap[item] = (frequencyMap[item] || 0) + 1;
        
            if (frequencyMap[item] > maxCount) {
                maxCount = frequencyMap[item];
                mostFrequent = item;
            }
        }
        return mostFrequent;
    }
    sortByStatus(orders)
    {
        const priority = this.statusOrder;
        orders.sort((a, b) => {
            const statusA = this._getPureStatus(a.status);
            const statusB = this._getPureStatus(b.status);
            return priority.indexOf(statusA) - priority.indexOf(statusB)
        });
        
    }
    _getPureStatus(overallStatus)
    {
        return overallStatus.includes(this.PARTIALLY) ? overallStatus.substring(this.PARTIALLY.length) : overallStatus
    }
      
}
const orderEnricher = new OrderEnricher(orderItemServices.statusOrder); 
const filterToWhereConverter = new FilterToWhereConverter({
    toLike: [
        'notes',
        'productName',
        'variantName',
        'customerName'
    ]
})