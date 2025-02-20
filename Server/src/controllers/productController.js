import { convertAllPathsToURLs } from '../common/index.js';
import { productServices, storeServices } from '../services/index.js';
import { productTransform } from './transformer/index.js';

const fetchProducts = async (req, res) => {
    const {page, ...filter} = req.query;
    if(filter.category == '' || filter.category?.toLowerCase() == 'all') delete filter.category;

    const result = await productServices.fetchAvailableProducts(page, filter);
    
    result.items.forEach( product => transform(product, req));
    res.json(result || {});
}

const fetchOwnedProducts =  async (req, res) => {
    const {page, ...filter} = req.query;
    const result = await productServices.fetchProductsOfStore(req.decodedAuthToken.storeId, page, filter);

    result.items.forEach( product => transform(product, req));
    res.json(result || {});
}

const fetchProduct = async (req, res) => {
    const {id} = req.params;
    const product = await productServices.fetchProduct(id);
    transform(product, req)
    res.json(product);
}

const fetchProductByVariant = async (req, res) => {
    const {id} = req.params;
    const product = await productServices.fetchProductByVariant(id);
    transform(product, req);
    res.json(product);
}

const createProduct = async (req, res) => {
    const { body, decodedAuthToken } = req;
    const { defaultVariantData, ...productData } = body;

    const result = await productServices.createProduct({
        productData,
        defaultVariantData
    }, decodedAuthToken.storeId);
    res.json(result || {});
}

const editProduct = async(req, res) => {
    const { id } = req.params;
    const { body, decodedAuthToken } = req;

    const result = await productServices.editProduct(id, decodedAuthToken.storeId, body);
    res.json(result || {});
}

const deleteProduct = async(req, res) => {
    const { id } = req.params;
    const result = await productServices.deleteProduct(id, req.decodedAuthToken.storeId);
    res.json(result || {});
}

function transform(product, req)
{
    productTransform.flattenProductImages(product)
    convertAllPathsToURLs(req, product);
}

export default {
    fetchProduct,
    fetchProductByVariant,
    fetchOwnedProducts,
    fetchProducts,
    createProduct,
    editProduct,
    deleteProduct
};

// TODO: Delete Product