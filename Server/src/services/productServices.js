import databaseInitializePromise from '../database/initialize.js'
import productImageServices from './productImageServices.js';
import storeServices from './storeServices.js';
import variantServices from './variantServices.js';
const { Product } = await databaseInitializePromise;

async function fetchProducts(filter) 
{
    const { whereClause, storeWhereClause } = await convertToWhereClauses(filter);
    const products = await Product.scope('withProductImages', 'withStore').findAll({
        where: whereClause,
        include: [{
            model: 'store',
            where: storeWhereClause,
            attributes: ['storeName']
        }]
    });
    return products.map(product => product.get());
}

async function fetchProduct(id){
    const product = await Product.scope('withProductImages', 'withStore', 'withVariants').findByPk(id)
    if(!product) throw new Error('Product not found');
    return product.get();
}


async function createProduct(productData, productImageFiles, variantData, decodedAuthToken) 
{
    const storeId = await storeServices.fetchStoreIdOfUser(decodedAuthToken.id);

    await Product.sequelize.transaction(async (t) => {
        const product = await Product.create({ ...productData, storeId });

        await productImageServices.createProductImages(productImageFiles, product.id);
        await variantServices.createVariants(variantData, product.id);
    });
    return { result: 'created product' };
}

async function editProduct(productId, productData, productImageFiles, variantData, decodedAuthToken) 
{
    const storeId = await storeServices.fetchStoreIdOfUser(decodedAuthToken.id);

    await Product.sequelize.transaction(async (t) => {
        const product = await Product.findByPk(productId);

        if (!product) throw new Error('Product not found');
        if (product.storeId !== storeId) throw new Error('Unauthorized');

        await product.update(productData);

        await productImageServices.updateProductImages(productImageFiles, product.id);
        await variantServices.updateVariants(variantData, product.id);
    });
    return { result: 'updated product' };
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

export default {
    fetchProducts,
    fetchProduct,
    createProduct,
    editProduct
};

// TODO: Delete Product