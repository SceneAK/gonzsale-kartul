import initializePromise from '../database/initialize.js';
import productServices from './productServices.js';
import ApplicationError from '../common/errors.js';
const { OrderItem } = await initializePromise;

async function fetchOrderItems(orderId)
{
    const items = await OrderItem.findAll({ where: { orderId } })
    return items.map(item => item.toJSON());
}

async function create(orderItems)
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

async function updateStatus(id, status)
{
    return await OrderItem.update({status}, {where: {id}});
}

async function updateStatusesByProduct(productId, status)
{
    return await OrderItem.update({status}, {where: {productId}});
}

const ATTRIBUTES = ['id', 'quantity', 'unitPrice', 'notes', 'status'];
function include(level)
{
    switch (level) {
        case 'serveWithProduct':
            return {
                model: OrderItem,
                attributes: ATTRIBUTES,
                include: productServices.include('serveBasicWithImages')
            }
        case 'serve':
            return {
                model: OrderItem,
                attributes: ATTRIBUTES
            }
        default:
            return {
                model: OrderItem
            }
    }
}

export default {fetchOrderItems, completeAndValidate, create, updateStatus, updateStatusesByProduct, include}