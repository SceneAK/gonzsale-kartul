import ApplicationError from '../common/errors.js';
import databaseInitializePromise from '../database/initialize.js';
import { paginationOption, reformatFindCountAll } from '../common/index.js';
const { Product } = await databaseInitializePromise;

async function fetchAndCountAll(scope, page = 1, options)
{
    const ITEMS_PER_PAGE = 40;
    const result = await Product.scope(scope).findAndCountAll({
        ...options,
        ...paginationOption(page, ITEMS_PER_PAGE)
    });
    return reformatFindCountAll(result, page, ITEMS_PER_PAGE).itemsToJSON();
}

async function fetchProduct(id, options){
    const product = await Product.findByPk(id, options);
    if(!product) throw new ApplicationError('Product of such id not found', 404);
    return product.toJSON();
}
async function fetchOneProduct(options)
{
    const product = await Product.findOne(options);
    if(!product) throw new ApplicationError('Product not found', 404);
    return product.toJSON();
}

async function fetchProducts(ids)
{
    const products = await Product.findAll({where: { id: ids }})
    return products.map(product => product.toJSON());
}

async function _createProduct(storeId, productData)
{
    const product = await Product.create({ ...productData, storeId });
    return product.toJSON();
}

async function editProduct(id, productData) 
{
    await Product.update(productData, { where: { id } })
    return id;
}

async function _deleteProduct(id)
{
    await Product.destroy({where: {id}});
}

async function ensureBelongsToStore(productId, storeId)
{
    const product = await fetchProduct(productId, {attributes: ['storeId']});
    ensureProductBelongsToStore(product, storeId);
}
function ensureProductBelongsToStore(product, storeId)
{
    if(product.storeId != storeId) throw new ApplicationError("Store does not own product", 401);
}

function include(scope, options)
{
    return {
        model: Product.scope(scope),
        ...options
    }
}

export default {
    fetchAndCountAll,
    fetchProduct,
    fetchOneProduct,
    fetchProducts,
    _createProduct,
    editProduct,
    _deleteProduct,
    ensureProductBelongsToStore,
    ensureBelongsToStore,
    include,
    sequelize: Product.sequelize
};