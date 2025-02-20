import { storeServices } from '../services/index.js';
import { logger, convertAllPathsToURLs } from '../common/index.js';

const fetchStore = async (req, res) =>{
    const { id } = req.params;
    const store = await storeServices.fetchStore(id);
    convertAllPathsToURLs(req, store);
    res.json(store);
}

const fetchOwnedStore = async (req, res) =>{
    const store = await storeServices.fetchStore(req.decodedAuthToken.storeId);
    convertAllPathsToURLs(req, store);
    res.json(store);
}

const createStore = async (req, res, next) =>
{
    const {decodedAuthToken, files, body} = req;
    const result = await storeServices.createStore(body, files, decodedAuthToken.id);
    
    logger.info('Created Store by User ', decodedAuthToken.id, '. Result: ', result);
    res.json(result || {});
}

const updateStore = async (req, res) => 
{
    const {decodedAuthToken, files, body} = req;
    const result = await storeServices.updateStore(body, files, decodedAuthToken);
    res.json(result || {});
}

export default  { fetchStore, fetchOwnedStore, createStore, updateStore }