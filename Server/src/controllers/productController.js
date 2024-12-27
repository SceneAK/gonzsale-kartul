import { convertAllImagePathsToURLs } from '../common/pathToURLConverter.js';
import { productServices } from '../services/index.js';
import { logger } from '../modules/logger.js';

const fetchProducts = async (req, res) => {
    const filter = req.params;
    try
    {
        const products = await productServices.fetchProducts(filter);
        const transformed = products.map( product => convertAllImagePathsToURLs(req.protocol, req.hostname, product));
        res.json(transformed);
    }catch(err){
        res.sendStatus(500);
    }
}

const fetchProduct = async (req, res) => {
    const {id} = req.params;
    try
    {
        const product = await productServices.fetchProduct(id);
        res.json(convertAllImagePathsToURLs(req.protocol, req.hostname, product));
    }catch(err){
        res.sendStatus(400);
    }
}


const createProduct = async (req, res) => {
    try
    {
        const { body, files, decodedAuthToken } = req;
        const { variants, ...productData } = body;
        const result = await productServices.createProduct(productData, files, variants, decodedAuthToken);
        res.send(result);
    }catch(err){
        res.sendStatus(400);
    }
}

const editProduct = async(req, res) => {
    try
    {
        const { body, files, decodedAuthToken } = req;
        const { variants, ...productData } = body;
        const result = await productServices.editProduct(productData, files, variants, decodedAuthToken);
        res.send(result);
    }catch(err){
        res.sendStatus(400);
    }
}
export default {
    fetchProduct,
    fetchProducts,
    createProduct,
    editProduct
};

// TODO: Delete Product