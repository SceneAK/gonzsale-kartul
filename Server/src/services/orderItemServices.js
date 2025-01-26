import initializePromise from '../database/initialize.js';
import productServices from './productServices.js';
import ApplicationError from '../common/errors.js';
const { OrderItem } = await initializePromise;

async function createOrderItems(orderItems)
{
    await OrderItem.bulkCreate(orderItems);
}

async function completeAndValidate(orderItems, orderId)
{
    const products = await fetchProductsOfOrderItems(orderItems);

    for (let i = 0; i < orderItems.length; i++) {
        if(products[i].availability == 'UNAVAILABLE') throw new ApplicationError("Order contains unavailable product", 400);
        if(products[i].storeId != products[0].storeId) throw new ApplicationError("Order contains products of mixed store origin", 400);

        const unitPrice = products[i].price;
        orderItems[i] = {...orderItems[i], orderId, unitPrice};
    }
    return products[0].storeId;
}

async function fetchProductsOfOrderItems(orderItems)
{
    const productIds = orderItems.map( orderItem => orderItem.productId);
    return await productServices.fetchProductsPlain(productIds);
}

function include(level)
{
    switch (level) {
        case 'serve':
            return {
                model: OrderItem,
                attributes: ['id', 'quantity', 'unitPrice', 'notes', 'status'],
                include: productServices.include('serve')
            }
        default:
            return {
                model: OrderItem
            }
    }
}

export default {completeAndValidate, createOrderItems, include}