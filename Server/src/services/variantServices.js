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
    const variant = await Variant.findByPk(id, options);
    if(!variant) throw new ApplicationError('Variant not found', 404)
    return variant.toJSON();
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

async function createVariants(productId, variantDataArr, requesterStoreId)
{
    await baseProductServices.ensureBelongsToStore(productId, requesterStoreId);
    _createVariants(productId, variantDataArr)
}
async function _createVariants(productId, variantDataArr)
{
    const complete = variantDataArr.map( variantData => ({productId, ...variantData}) )
    await Variant.bulkCreate(complete);
}
async function deleteVariant(id, requesterStoreId)
{
    const variantWithProducts = await _fetchVariant(id, { include: baseProductServices.include()})
    await ensureVariantBelongsToStore(variantWithProducts, requesterStoreId);

    if(variantWithProducts.isDefault) throw new ApplicationError("Cannot delete default variant! Please set a different variant as default first. ", 400);
    
    await Variant.destroy({ where: {id} });
}
async function _deleteAllVariantsOfProduct(productId)
{
    await Variant.destroy({where: {productId}});
}

async function setDefault(id, requesterStoreId)
{
    const variantWithProduct = await _fetchVariant(id, {include: baseProductServices.include()});
    await ensureVariantBelongsToStore(variantWithProduct, requesterStoreId);
    
    await Variant.update({isDefault: false}, {where: {productId: variantWithProduct.productId} });
    await Variant.update({isDefault: true}, {where: {id: variantWithProduct.id} });
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
function includeSpecific(variantId)
{
    return {
        model: Variant,
        attributes: ATTRIBUTES,
        where: { id: variantId }
    }
}

export default {
    fetchVariantIncludeProduct,
    fetchVariantsIncludeProduct,
    bulkUpsertStock,
    createVariants,
    _createVariants,
    editVariant,
    setDefault,
    deleteVariant,
    _deleteAllVariantsOfProduct,
    include,
    includeSpecific
}