import { storeAnalyticsServices, storeServices } from '../services/index.js';
import { logger } from '../systems/index.js';
import { convertAllPathsToURLs } from '../common/index.js';
import { setAuthTokenCookie } from './cookieSetter.js';

const fetchStore = async (req, res) =>{
    const { id } = req.params;
    const store = await storeServices.fetchStore(id);
    convertAllPathsToURLs(req, store);
    res.json(store);
}
const fetchStores = async (req, res) => {
    const stores = await storeServices.fetchStores(req.query.page);
    res.json(stores || {});
}

const createStore = async (req, res, next) =>
{
    const {authJwt, body} = req;
    const result = await storeServices.createStore(body, authJwt.id);
    await setAuthTokenCookie(res, authJwt);
    logger.info('Created Store by User ', authJwt.id, '. Result: ', result);
    res.json(result || {});
}

const updateStore = async (req, res) => 
{
    const {authJwt, body} = req;
    const result = await storeServices.updateStore(body, authJwt);
    res.json(result || {});
}

const updateStoreImage = async (req, res) => {
    const result = await storeServices.updateStoreImage(req.file, req.authJwt);
    res.json(result || {});
}

const fetchStoreAnalytics = async (req, res) => {
    const dateRange = req.query;
    const result = await storeAnalyticsServices.fetchStoreAnalytics(req.params.id, dateRange);
    res.json(result || {})
}

export default  { fetchStore, fetchStores, createStore, updateStore, updateStoreImage, fetchStoreAnalytics }