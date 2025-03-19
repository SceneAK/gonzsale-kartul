import ApplicationError from '../common/errors.js';
import dbInitPromise from '../database/initialize.js';
import { paginationOption, reformatFindCountAll } from '../common/pagination.js';
const { Order } = await dbInitPromise;

async function fetchAll(options)
{
    const results = await Order.findAll(options)
    return results.map( result => result.toJSON());
}
async function fetchOrder(id, options)
{   
    const orderModel = await Order.findByPk(id, options);
    if(!orderModel) throw new ApplicationError('Order not found', 404);
    return orderModel.toJSON();
}
async function fetchAndCountAll(page, options)
{
    const ITEMS_PER_PAGE = 10;
    const result = await Order.findAndCountAll({
        ...options,
        ...paginationOption(page, ITEMS_PER_PAGE)
    });
    return reformatFindCountAll(result, page, ITEMS_PER_PAGE).itemsToJSON();
}

async function _createOrder(customerDetails, storeId, options)
{
    const orderModel = await Order.create({...customerDetails, storeId}, options);
    return orderModel.toJSON();
}

async function _deleteOrder(id)
{
    await Order.destroy({where: {id}});
}

function ensureIsStoreOwnsOrder(order, storeId)
{
    if(order.storeId != storeId) throw new ApplicationError("Order does not belong to this seller", 401);
}

function include(options)
{
    return { 
        model: Order,
        ...options
    }
}

export default {
    fetchOrder,
    fetchAndCountAll,
    fetchAll,
    _createOrder,
    _deleteOrder,
    ensureIsStoreOwnsOrder,
    include,
    sequelize: Order.sequelize
}