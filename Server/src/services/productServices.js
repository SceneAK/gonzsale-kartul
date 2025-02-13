import ApplicationError from '../common/errors.js';
import productImageServices from './productImageServices.js';
import storeServices from './storeServices.js';
import variantServices from './variantServices.js';
import baseProductServices from './baseProductServices.js';

const BASIC_ATTRIBUTES = ['id', 'name', 'isAvailable'];
const INCLUDE_DEFAULT_AND_IMAGE = [
    variantServices.include('serveDefault'),
    productImageServices.include('serveOne'),
]

async function fetchAvailableProducts(page = 1, where = {})
{
    let result = await baseProductServices.fetchAndCountAll('Available', page, {
        attributes: [...BASIC_ATTRIBUTES, 'storeId', 'category', 'isAvailable'],
        where,
        include: [
            ...INCLUDE_DEFAULT_AND_IMAGE,
            storeServices.include('serveName'),
        ]
    });
    return result;
}

async function fetchProductsOfStore(storeId, page = 1)
{
    const result = await baseProductServices.fetchAndCountAll('default', page, {
        attributes: [...BASIC_ATTRIBUTES, 'storeId', 'category', 'isAvailable'],
        where: {storeId},
        include: INCLUDE_DEFAULT_AND_IMAGE
    });
    return result;
}

async function fetchProduct(id){
    const product =  await baseProductServices.fetchProduct(id, {
        attributes: [...BASIC_ATTRIBUTES, 'description', 'category', 'isAvailable'],
        include: [
            variantServices.include('serve'),
            productImageServices.include('serve'),
            storeServices.include('serveWithAll')
        ]
    });   
    return product;
}

async function createProduct(data, requesterStoreId) 
{
    let {productData, defaultVariantData} = data;
    defaultVariantData = {...defaultVariantData, isDefault: true};

    let product;
    await baseProductServices.sequelize.transaction(async t => {
        product = await baseProductServices._createProduct(storeId, productData);
        await variantServices._createVariant(product.id, defaultVariantData)
    });
    return { productId: product?.id };
}

async function editProduct(id, requesterStoreId, productData) 
{
    await baseProductServices.ensureBelongsToStore(id, requesterStoreId);
    const result = await baseProductServices.editProduct(id, productData);
    return { result };
}


export default {
    fetchAvailableProducts,
    fetchProductsOfStore,
    fetchProduct,
    createProduct,
    editProduct
};