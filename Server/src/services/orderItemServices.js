import initializePromise from '../database/initialize.js';
import productServices from './productServices.js';
import ApplicationError from '../common/errors.js';
import storeServices from './storeServices.js';
const { OrderItem } = await initializePromise;

async function fetchOrderItems(where, attributes = ATTRIBUTES)
{
    const items = await OrderItem.findAll({ where, attributes })
    return items.map(item => item.toJSON());
}
async function fetchByPk(id, attributes = ATTRIBUTES)
{
    const model = await OrderItem.findByPk(id, { attributes });
    if(!model) throw new ApplicationError("Order item not found", 404);
    return model.toJSON();
}

async function create(orderItems)
{
    await OrderItem.bulkCreate(orderItems);
}

async function completeAndValidate(orderItems, orderId)
{
    const products = await fetchProductsOfOrderItems(orderItems);
    const productIds = [];
    for (let i = 0; i < orderItems.length; i++) {
        if(productIds.includes(orderItems[i].productId)) throw new ApplicationError("Order contains duplicate product", 400);
        if(products[i].availability == 'UNAVAILABLE') throw new ApplicationError("Order contains unavailable product", 400);
        if(products[i].storeId != products[0].storeId) throw new ApplicationError("Order contains products of mixed store origin", 400);

        const unitPrice = products[i].price;
        orderItems[i] = {...orderItems[i], orderId, unitPrice};
        productIds.push(orderItems[i].productId);
    }
    return products[0].storeId;
}

async function fetchProductsOfOrderItems(orderItems)
{
    const productIds = orderItems.map( orderItem => orderItem.productId);
    return await productServices.fetchProductsPlain(productIds);
}

const statusOrder = ['PENDING', 'PROCESSING', 'READY', 'COMPLETED', 'CANCELLED'];

async function updateStatus(id, status, requesterId)
{
    const orderItem = await fetchByPk(id, ['status', 'productId']);
    await ensureRequesterBelongsProduct(orderItem.productId, requesterId);
    validateStatusTransition(orderItem.status, status);

    return await OrderItem.update({status}, {where: {id}});
}

async function updateStatusesByProduct(productId, status, requesterId)
{
    await ensureRequesterBelongsProduct(productId, requesterId);

    const orderItems = await OrderItem.findAll({ where: { productId }, raw: true })

    const valids = [];
    for (const item of orderItems) {
        if(isValidStatusTransition(item.status, status))
        {
            valids.push({...item, status});
        }
    }
    
    await OrderItem.bulkCreate(valids, {updateOnDuplicate: ['status']});
}

async function ensureRequesterBelongsProduct(productId, requesterId)
{
    const result = await productBelongsToUser(productId, requesterId);
    if(!result) throw new ApplicationError("Product does not belong to user", 400);
}
async function productBelongsToUser(productId, requesterId)
{
    const products = await productServices.fetchProductsPlain([productId]);
    const storeId = await storeServices.fetchStoreIdOfUser(requesterId);
    return products[0].storeId == storeId;
}

function validateStatusTransition(current, request)
{
    if(!isValidStatusTransition(current, request)) throw new ApplicationError("Invalid status transition", 400);
}

function isValidStatusTransition(current, request)
{
    const correcOrder = statusOrder.indexOf(current) < statusOrder.indexOf(request);
    const completedOrCancelled = current == 'COMPLETED' || current == 'CANCELLED';
    return correcOrder && !completedOrCancelled;
}

function createStatusSortLiteral(statusOrder)
{
    let literal = 'CASE ';
    statusOrder.forEach( (status, index) => {
        literal += `WHEN status = ${status} THEN ${index+1} `;
    })
    literal += `END`;
    return OrderItem.sequelize.literal(literal);
}

const ATTRIBUTES = ['id', 'quantity', 'unitPrice', 'notes', 'status'];

const statusSortLiteral = createStatusSortLiteral(statusOrder)
const order = [[statusSortLiteral, 'ASC']]

function include(level)
{
    switch (level) {
        case 'serveWithProduct':
            return {
                model: OrderItem,
                attributes: ATTRIBUTES,
                include: productServices.include('serveBasicWithImages'),
                order
            }
        case 'serve':
            return {
                model: OrderItem,
                attributes: ATTRIBUTES,
                order
            }
        default:
            return {
                model: OrderItem
            }
    }
}

export default {
    fetchOrderItems, 
    completeAndValidate, 
    create, 
    updateStatus, 
    updateStatusesByProduct, 
    statusOrder,
    include
}