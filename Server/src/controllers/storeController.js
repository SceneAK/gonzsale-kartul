import { storeServices } from '../services/index.js';
import { logger } from '../systems/index.js';
import { convertAllPathsToURLs } from '../common/index.js';
import { setAuthTokenCookie } from './cookieSetter.js';

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
    const {decodedAuthToken, body} = req;
    const result = await storeServices.createStore(body, decodedAuthToken.id);
    await setAuthTokenCookie(res, decodedAuthToken);
    logger.info('Created Store by User ', decodedAuthToken.id, '. Result: ', result);
    res.json(result || {});
}

const updateStore = async (req, res) => 
{
    const {decodedAuthToken, body} = req;
    const result = await storeServices.updateStore(body, decodedAuthToken);
    res.json(result || {});
}

const updateStoreImage = async (req, res) => {
    const result = await storeServices.updateStoreImage(req.file, req.decodedAuthToken);
    res.json(result || {});
}

export default  { fetchStore, fetchOwnedStore, createStore, updateStore, updateStoreImage }