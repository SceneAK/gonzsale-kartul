import initializePromise from '../database/initialize.js';
import ApplicationError from '../common/errors.js';
import variantServices from './variantServices.js';
import baseOrderServices from './baseOrderServices.js';
import FilterToWhereConverter from '../common/filterToWhere.js';
const { OrderItem } = await initializePromise;

async function fetchOrderItems(orderId)
{
    const models = await OrderItem.findAll({where:{orderId}, order});
    return models.map(model => model.toJSON());
}
async function _fetchByPk(id, options)
{
    const model = await OrderItem.findByPk(id, options);
    if(!model) throw new ApplicationError("Order item not found", 404);
    return model.toJSON();
}

async function _createOrderItems(orderItems, orderId, transaction)
{
    const orderItemsWithVariantProduct = await attatchAssociatedVariantProduct(orderItems);
    validatePotentialOrderVariants(orderItemsWithVariantProduct);
    
    const completedOrderItems = await completeOrderItemsData(orderItemsWithVariantProduct, orderId);
    
    await OrderItem.bulkCreate(completedOrderItems, {transaction});
    await stockUpdater.decrementCorrespondingStocks(orderItemsWithVariantProduct);
}
async function attatchAssociatedVariantProduct(orderItems)
{
    const variantIds = orderItems.map( item => item.variantId);
    const variants = await variantServices.fetchVariantsIncludeProduct(variantIds);
    
    return orderItems.map( (orderItem) => { 
        const correspondingVariant = variants.find( variant => orderItem.variantId == variant.id )
        if(correspondingVariant)
        {
            return {...orderItem, Variant: correspondingVariant }
        }else{
            throw new ApplicationError(`Variant of id ${orderItem.variantId} could not be found`, 404);
        }
    } )
}
async function completeOrderItemsData(orderItemsWithVariantProduct, orderId)
{
    return orderItemsWithVariantProduct.map( withVariantProduct => {
        const { Variant, ...orderItemData } = withVariantProduct;
        const { Product } = Variant;

        return {
            orderId,
            ...orderItemData, 

            variantName: Variant.name,
            variantUnit: Variant.unit,
            variantPrice: Variant.price,

            productId: Product.id,
            productName: Product.name,
            productDescription: Product.description
        };
    })
}
function validatePotentialOrderVariants(orderItemsWithVariantProduct)
{
    const commonStoreId = orderItemsWithVariantProduct[0].Variant.Product.storeId;
    const seenVariants = new Set();
    orderItemsWithVariantProduct.forEach( orderItem => {
        const { Variant, quantity, variantId } = orderItem;
        const { Product } = Variant;

        if(Variant.stock - quantity < 0) throw new ApplicationError(`Insufficient Stock: "${Product.name} - ${Variant.name}"`, 400);

        if(!Product.isAvailable) throw new ApplicationError(`Order contains unavailable product "${Product.name}"`, 400);
        if(Product.storeId != commonStoreId) throw new ApplicationError("Order contains products of mixed store origin", 400);
        if(seenVariants.has(variantId)) throw new ApplicationError(`Order contains duplicate variant "${variantId}"`, 400);
        seenVariants.add(variantId);
    } )
}

const statusOrder = ['PENDING', 'PROCESSING', 'READY', 'COMPLETED', 'CANCELLED'];

async function updateStatus(id, status, requesterStoreId)
{
    const orderItemWithVariant = await _fetchByPk(id, {
        attributes: ['status', 'quantity'], 
        include: [
            variantServices.include(),
            baseOrderServices.include()
        ]}
    );
    baseOrderServices.ensureStoreOwnsOrder(orderItemWithVariant.Order, requesterStoreId);
    validateStatusTransition(orderItemWithVariant.status, status);

    let result;
    await OrderItem.sequelize.transaction( async t => {
        if(status == "CANCELLED") 
        {
            await stockUpdater.incrementCorrespondingStocks([orderItemWithVariant]);
        }
    
        result = await OrderItem.update({status}, {where: {id}});
    })
    return result;
}

async function bulkUpdateStatus(filter, requestedStatus, requesterStoreId)
{
    const where = filterToWhereConverter.convert(filter); 
    let orderItems = await OrderItem.findAll({ 
        where, 
        include: [variantServices.include(), baseOrderServices.include()]
    })
    if(orderItems.length == 0) return;
    orderItems = orderItems.map( item => item.toJSON())

    ensureSameStore(orderItems);
    baseOrderServices.ensureStoreOwnsOrder(orderItems[0].Order, requesterStoreId);

    const updated = [];
    orderItems.forEach( orderItem => {
        if(isValidStatusTransition(orderItem.status, requestedStatus))
        {
            updated.push({...orderItem, status: requestedStatus});
        }
    })

    let result;
    await OrderItem.sequelize.transaction(async transaction => {
        if(requestedStatus == "CANCELLED")
        {
            await stockUpdater.incrementCorrespondingStocks(updated, transaction);
        }
        result = await OrderItem.bulkCreate(updated, { transaction, updateOnDuplicate: ['status'] });
    })
    return result;
}
function ensureSameStore(orderItemsWithOrder)
{
    const firstItem = orderItemsWithOrder[0].Order;
    const differentStore = orderItemsWithOrder.some( item => item.Order.storeId != firstItem.storeId )
    if(differentStore) throw new ApplicationError('Bulk Update Status cannot be across different stores', 401);
}

async function _deleteOrderItemsOfOrder(orderId)
{
    await OrderItem.destroy({where: {orderId}});
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
        literal += `WHEN status = "${status}" THEN ${index+1} `;
    })
    literal += `END`;
    return OrderItem.sequelize.literal(literal);
}

const statusSortLiteral = createStatusSortLiteral(statusOrder)
const order = [[statusSortLiteral, 'ASC']]

function include(level)
{
    switch (level) {
        case 'serve':
            return {
                model: OrderItem,
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
    _createOrderItems, 
    _deleteOrderItemsOfOrder,
    updateStatus, 
    bulkUpdateStatus, 
    statusOrder,
    include
}

class OrderItemStockUpdater {
    constructor(variantServices)
    {
        this.variantServices = variantServices;
    }
    async incrementCorrespondingStocks(orderItemsWithVariant, transaction)
    {
        const reversed = orderItemsWithVariant.map( item => ( { ...item, quantity: -item.quantity } ) );
        await this.decrementCorrespondingStocks(reversed, transaction)
    }
    async decrementCorrespondingStocks(orderItemsWithVariant, transaction)
    {
        const stockUpdateData = await this.buildStockUpdateData(orderItemsWithVariant);
        await this.variantServices.bulkUpsertStock(stockUpdateData, transaction);
    }
    async buildStockUpdateData(orderItemsWithVariant)
    {
        return orderItemsWithVariant.map( orderItem => ({
            ...orderItem.Variant,
            stock: (orderItem.Variant.stock - orderItem.quantity)
        }))
    }
}
const stockUpdater = new OrderItemStockUpdater(variantServices)
const filterToWhereConverter = new FilterToWhereConverter({
    toLike: [
        'notes'
    ]
});