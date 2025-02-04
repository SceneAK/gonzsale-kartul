import { convertAllPathsToURLs } from '../common/index.js';
import { productServices, storeServices } from '../services/index.js';

const fetchProducts = async (req, res) => {
    const {page, ...where} = req.query;
    if(where.category == '') delete where.category;
    const products = await productServices.fetchPublicProducts(page, where);
    products.forEach( product => transform(product, req));
    res.json(products);
}

const fetchOwnedProducts =  async (req, res) => {
    const {page} = req.query;
    const storeId = await storeServices.fetchStoreIdOfUser(req.decodedAuthToken.id);
    const products = await productServices.fetchProductsOfStore(storeId, page);
    products.forEach( product => transform(product, req));
    res.json(products);
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
    const {id} = req.params;
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
    convertAllPathsToURLs(req.protocol, req.hostname, product);
    flattenProductImages(product);
}
function flattenProductImages(product)
{
    for (let i = 0; i < product.ProductImages.length; i++) {
        const image = product.ProductImages[i].Image;
        product.ProductImages[i] = {...product.ProductImages[i], ...image}
        delete product.ProductImages[i].Image
    }
}


export default {
    fetchProduct,
    fetchOwnedProducts,
    fetchProducts,
    createProduct,
    editProduct
};

// TODO: Delete Product