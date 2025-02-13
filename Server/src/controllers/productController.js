import { convertAllPathsToURLs } from '../common/index.js';
import { productServices, storeServices } from '../services/index.js';
import { productTransform } from './transformer/index.js';

const fetchProducts = async (req, res) => {
    const {page, ...where} = req.query;
    if(where.category == '' || where.category?.toLowerCase() == 'all') delete where.category;

    const result = await productServices.fetchAvailableProducts(page, where);
    
    result.items.forEach( product => transform(product, req));
    res.json(result);
}

const fetchOwnedProducts =  async (req, res) => {
    const {page} = req.query;
    const result = await productServices.fetchProductsOfStore(req.decodedAuthToken.storeId, page);

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
    const { body, decodedAuthToken } = req;
    const { defaultVariantData, ...productData } = body;

    const result = await productServices.createProduct({
        productData,
        defaultVariantData
    }, decodedAuthToken.storeId);
    res.json(result);
}

const editProduct = async(req, res) => {
    const { id } = req.params;
    const { body, decodedAuthToken } = req;

    const result = await productServices.editProduct(id, decodedAuthToken.storeId, body);
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