import ApplicationError from '../common/errors.js';
import databaseInitializePromise from '../database/initialize.js'
import baseProductServices from './baseProductServices.js';
const { Variant } = await databaseInitializePromise;

const ATTRIBUTES = ['id', 'name', 'price', 'unit', 'stock', 'isDefault']

async function fetchVariantIncludeProduct(id)
{
    const results = await fetchVariantsIncludeProduct([id]);
    if(results.length == 0) throw new ApplicationError('variantId not found', 400);
    return results[0];
}
async function fetchVariantsIncludeProduct(ids)
{
    const variants = await Variant.findAll({where: {id: ids}, include: baseProductServices.include()});
    return variants.map( variant => variant.toJSON());
}
async function _fetchVariant(id, options)
{
    const variant = await Variant.findByPk(id, {raw: true, ...options});
    if(!variant) throw new ApplicationError('Variant not found', 404)
    return variant;
}

// async function fetchVariantsOfProduct(productId)
// {
//     const variants = await Variant.findAll({where: {productId}});
//     return variants.map(variant => variant.toJSON());
// }

async function bulkUpsertStock(stockUpdateData, transaction)
{
    await Variant.bulkCreate(stockUpdateData, {
        updateOnDuplicate: ['stock'], transaction
    })
}

async function editVariant(id, variantData, requesterStoreId)
{
    await ensureBelongsToStore(id, requesterStoreId);
    return await Variant.update(variantData, {where: {id}, raw: true});
}

async function deleteVariant(id, requesterStoreId)
{
    await ensureBelongsToStore(id, requesterStoreId);

    const variant = _fetchVariant(id);
    if(variant.isDefault) throw new ApplicationError("Cannot delete default variant! Please set a different variant as default first. ", 400);
    
    await Variant.destroy({ where: {id} });
}

async function createVariant(productId, variantData, requesterStoreId)
{
    await baseProductServices.ensureBelongsToStore(productId, requesterStoreId);
    _createVariant(productId, variantData)
}
async function _createVariant(productId, variantData)
{
    await Variant.create({productId, ...variantData});
}

async function setDefault(id, requesterId)
{
    const variant = await _fetchVariant(id, {include: baseProductServices.include()});
    await ensureBelongsToStore(variant.Product, requesterId);
    
    await Variant.update({isDefault: false}, {where: {productId: variant.productId} });
    await Variant.update({isDefault: true}, {where: {id: variant.id} });
}

async function ensureBelongsToStore(variantId, requesterStoreId)
{
    const variantWithProduct = await _fetchVariant(variantId, { include: baseProductServices.include()});
    ensureVariantBelongsToStore(variantWithProduct, requesterStoreId);
}
function ensureVariantBelongsToStore(variantWithProduct, requiredStoreId)
{
    baseProductServices.ensureProductBelongsToStore(variantWithProduct.Product, requiredStoreId);
}

function include(level)
{
    switch (level) {
        case 'serve':
            return {
                model: Variant,
                attributes: ATTRIBUTES
            }
        case 'serveDefault':
            return {
                model: Variant,
                attributes: ATTRIBUTES,
                where: { isDefault: true }
            }
        default:
            return {
                model: Variant
            }
    }
    
}

export default {
    fetchVariantIncludeProduct,
    fetchVariantsIncludeProduct,
    bulkUpsertStock,
    createVariant,
    _createVariant,
    editVariant,
    setDefault,
    deleteVariant,
    include
}