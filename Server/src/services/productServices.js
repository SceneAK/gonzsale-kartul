import ApplicationError from '../common/errors.js';
import databaseInitializePromise from '../database/initialize.js'
import productImageServices from './productImageServices.js';
import storeServices from './storeServices.js';
import variantServices from './variantServices.js';
import { Op } from 'sequelize';
import fs from 'fs';
const { Product } = await databaseInitializePromise;

const GENERAL_ATTRIUTES = ['id', 'storeId', 'name', 'category', 'price', 'unit', 'availability'];
const SERVE_ATTRIBUTES = ['id', 'name', 'description', 'category', 'price', 'unit', 'availability'];

async function fetchProducts(filter) 
{
    const { whereClause, storeWhereClause } = await convertToWhereClauses(filter);
    const products = await Product.findAll({
        attributes: GENERAL_ATTRIUTES,
        where: whereClause,
        include: [
            { ...productImageServices.include('serve-image') },
            { ...storeServices.include('just-name'), where: storeWhereClause }
        ]
    });
    return products.map(product => product.toJSON());
}

async function fetchProduct(id){
    const product = await _fetchProduct(id, {
        attributes: SERVE_ATTRIBUTES,
        include: [
            {...storeServices.include('serve')},
            {...productImageServices.include('serve-image')}
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

async function convertToWhereClauses(filter) 
{
    let whereClause = {};
    let storeWhereClause = {};
    const { name, category, storeName, storeId } = filter;

    if(name)
    {
        whereClause = { ...whereClause, name: { [Op.like]: `${name}%` } };
    }
    if(category)
    {
        whereClause = { ...whereClause, category: { [Op.like]: `${category}%` } };
    }
    if(storeId)
    {
        storeWhereClause = { ...storeWhereClause, storeId };
    }
    if(storeName)
    {
        storeWhereClause = { ...storeWhereClause, storeName: { [Op.like]: `${storeName}%` } };
    }
    return { whereClause, storeWhereClause };
}

function include(level)
{
    switch (level) {
        case 'serve':
            return {
                model: Product,
                attributes: ['id', 'name'],
                include: productImageServices.include('serve-image')
            }
        default:
            return {
                model: Product
            }
    }
}

export default {
    fetchProducts,
    fetchProduct,
    fetchProductsPlain,
    createProduct,
    editProduct,
    include
};