import ApplicationError from '../common/errors.js';
import databaseInitializePromise from '../database/initialize.js'
import productImageServices from './productImageServices.js';
import storeServices from './storeServices.js';
import variantServices from './variantServices.js';
import fs from 'fs';
import { paginationOption, reformatFindCountAll } from '../common/index.js';
const { Product } = await databaseInitializePromise;

const BASIC_ATTRIBUTES = ['id', 'name'];
const GENERAL_ATTRIUTES = [...BASIC_ATTRIBUTES, 'storeId', 'category', 'price', 'unit', 'availability'];

async function fetchPublicProducts(page = 1, where = {}, attributes = GENERAL_ATTRIUTES)
{
    let result = await Product.scope('Public').findAndCountAll({
        attributes,
        where,
        include: [
            { ...productImageServices.include('serve') },
            { ...storeServices.include('justName') }
        ],
        ...paginationOption(page)
    });
    return reformatFindCountAll(result, page).itemsToJSON();
}

async function fetchProductsOfStore(storeId, page = 1)
{
    const result = await Product.findAndCountAll({
        attributes: GENERAL_ATTRIUTES,
        where: {storeId},
        include: [
            { ...productImageServices.include('serve-image') }
        ],
        ...paginationOption(page)
    });
    return reformatFindCountAll(result, page).itemsToJSON();
}

async function fetchProduct(id){
    const product = await _fetchProduct(id, {
        attributes: [...BASIC_ATTRIBUTES, 'description', 'category', 'price', 'unit', 'availability'],
        include: [
            {...storeServices.include('serveWithAll')},
            {...productImageServices.include('serve')}
        ]
    });
    return product.toJSON();
}

async function fetchProductsPlain(ids)
{
    const products = await Product.findAll({where: { id: ids }})
    return products.map(product => product.toJSON());
}

async function _fetchProduct(id, option)
{
    const result = await Product.findByPk(id, option);
    if(!result) throw new Error('Product not found');
    return result;
}

async function createProduct(userId, data) 
{
    const {productData, files, variants} = data;
    const storeId = await storeServices.fetchStoreIdOfUser(userId);

    await Product.sequelize.transaction(async t => {
        const product = await Product.create({ ...productData, storeId });
        await productImageServices.createProductImagesAuto(files, product.id);
        if(variants) await variantServices.createVariants(variants, product.id);
    });
    return { result: 'created product' };
}

async function editProduct(id, userId, data) 
{
    const {productData, files, actions, variants} = data;
    const storeId = await storeServices.fetchStoreIdOfUser(userId);

    await Product.sequelize.transaction(async t => {
        const product = await Product.findByPk(id);

        if (!product) throw new Error('Product not found');
        if (product.storeId !== storeId) throw new Error('Unauthorized');

        if(actions) await handleImageUpdate(id, userId, actions, files);
        if(productData) await Product.update(productData, { where: { id } })
    });

    if(files.length != 0) {
        files.forEach( file => fs.unlink(file, _ => _ ))
    }
    
    return { result: 'updated product' };
}
async function handleImageUpdate(productId, userId, actions, files)
{
    const original = await productImageServices.fetchProductImages(productId);
    const finalOrder = [];
    
    for (let index = 0; index < actions.length; index++) 
    {
        if(isId(actions[index]))
        {
            finalOrder.push(actions[index]);
        }else{
            const newFile = files.shift();
            if(!newFile) throw new ApplicationError("number of files does not match required files", 400);

            const [productImage] = await productImageServices.createProductImagesAuto([newFile], productId, userId);
            finalOrder.push(productImage.imageId);
        }
        
    }

    const unhandled = original.filter( item => !finalOrder.includes(item.imageId) );
    await productImageServices.deleteImages(unhandled.map( prdImg => prdImg.imageId ), userId);

    await productImageServices.reorderProductImages(finalOrder, productId);
}
function isId(str)
{
    const UUIDV4_HYPH_LEN = 36;
    return str.length == UUIDV4_HYPH_LEN;
}

function include(level)
{
    switch (level) {
        case 'serveBasicWithImages':
            return {
                model: Product,
                attributes: BASIC_ATTRIBUTES,
                include: productImageServices.include('serve')
            }
        default:
            return {
                model: Product
            }
    }
}

export default {
    fetchPublicProducts,
    fetchProductsOfStore,
    fetchProduct,
    fetchProductsPlain,
    createProduct,
    editProduct,
    include
};