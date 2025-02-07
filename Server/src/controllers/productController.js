import { convertAllPathsToURLs } from '../common/index.js';
import { productServices, storeServices } from '../services/index.js';
import { productTransform } from './transformer/index.js';

const fetchProducts = async (req, res) => {
    const {page, ...where} = req.query;
    if(where.category == '' || where.category?.toLowerCase() == 'all') delete where.category;

    const result = await productServices.fetchPublicProducts(page, where);
    
    result.items.forEach( product => transform(product, req));
    res.json(result);
}

const fetchOwnedProducts =  async (req, res) => {
    const {page} = req.query;
    const storeId = await storeServices.fetchStoreIdOfUser(req.decodedAuthToken.id);

    const result = await productServices.fetchProductsOfStore(storeId, page);

    result.items.forEach( product => transform(product, req));
    res.json(result);
}

const fetchProduct = async (req, res) => {
    const {id} = req.params;
    const product = await productServices.fetchProduct(id);
    transform(product, req)
    res.json(product);
}

const createProduct = async (req, res) => {
    const { body, files, decodedAuthToken } = req;
    const { variants, ...productData } = body;

    const result = await productServices.createProduct(decodedAuthToken.id, {
        productData,
        files,
        variants
    });
    res.json(result);
}

const editProduct = async(req, res) => {
    const { id } = req.params;
    const { body, files, decodedAuthToken } = req;
    const { variants, actionJson, ...productData } = body;
    const actions = JSON.parse(actionJson);
    const result = await productServices.editProduct(id, decodedAuthToken.id, {
        productData,
        files,
        actions,
        variants
    });
    res.json(result);
}

function transform(product, req)
{
    productTransform.flattenProductImages(product)
    convertAllPathsToURLs(req.protocol, req.hostname, product);
}

export default {
    fetchProduct,
    fetchOwnedProducts,
    fetchProducts,
    createProduct,
    editProduct
};

// TODO: Delete Product