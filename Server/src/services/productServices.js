import {ApplicationError, FilterToWhereConverter } from '../common/index.js';
import productImageServices from './productImageServices.js';
import storeServices from './storeServices.js';
import variantServices from './variantServices.js';
import baseProductServices from './baseProductServices.js';
const sequelize = baseProductServices.sequelize;

const BASIC_ATTRIBUTES = ['id', 'name'];

async function fetchAvailableProducts(page = 1, filter = {})
{
    const where = filterToWhereConverter.convert(filter);
    let result = await baseProductServices.fetchAndCountAll('Available', page, {
        attributes: [...BASIC_ATTRIBUTES, 'storeId', 'category'],
        where,
        include: [
            variantServices.include('serveDefault'),
            productImageServices.include('serveOne'),
            storeServices.include('serveName')
        ]
    });
    return result;
}

async function fetchProductsOfStore(storeId, page = 1, filter = {})
{
    const where = filterToWhereConverter.convert(filter);
    const result = await baseProductServices.fetchAndCountAll('', page, {
        attributes: [...BASIC_ATTRIBUTES, 'storeId', 'category', 'isAvailable'],
        where: {storeId},
        include: [
            productImageServices.include('serveOne'),
            variantServices.include('serve')
        ]
    });
    return result;
}

const DETAILED_ATTR = [...BASIC_ATTRIBUTES, 'description', 'category', 'isAvailable'];
async function fetchProduct(id){
    return await baseProductServices.fetchProduct(id, {
        attributes: DETAILED_ATTR, 
        include: [
            variantServices.include('serve'),
            productImageServices.include('serve'),
            storeServices.include('serveWithAll')
        ]
    });
}
async function fetchProductByVariant(variantId)
{
    return await baseProductServices.fetchOneProduct({
        include: [
            productImageServices.include('serve'),
            storeServices.include('serveName'),
            variantServices.includeSpecific(variantId)
        ]
    })
}

async function createProduct(data, requesterStoreId) 
{
    let {productData, defaultVariantData} = data;
    defaultVariantData = {...defaultVariantData, isDefault: true};

    let product;
    await sequelize.transaction(async t => {
        product = await baseProductServices._createProduct(requesterStoreId, productData);
        await variantServices._createVariants(product.id, [defaultVariantData])
    });
    return product;
}

async function editProduct(id, requesterStoreId, productData) 
{
    await baseProductServices.ensureBelongsToStore(id, requesterStoreId);
    const productId = await baseProductServices.editProduct(id, productData);
    return { id: productId };
}

async function deleteProduct(productId, requester)
{
    await baseProductServices.ensureBelongsToStore(productId, requester.storeId);
    await sequelize.transaction(async t =>{
        await productImageServices.deleteProductImages(productId, requester);
        await variantServices._deleteAllVariantsOfProduct(productId);
        await baseProductServices._deleteProduct(productId);
    })
}

function includeProductWithVariant(variantId)
{
    return baseProductServices.include({
        include: variantServices.includeSpecific(variantId)
    })
}

export default {
    fetchAvailableProducts,
    fetchProductsOfStore,
    fetchProduct,
    fetchProductByVariant,
    createProduct,
    editProduct,
    deleteProduct,
    includeProductWithVariant
};
const filterToWhereConverter = new FilterToWhereConverter({
    toLike: [
        'name',
        'category'
    ]
});