import { storeServices } from '../services/index.js';
import { convertAllImagePathsToURLs } from '../common/pathToURLConverter.js';
import { logger } from '../common/logger.js';

const fetchStore = async (req, res) =>{
    const { id } = req.params;
    try
    {
        const store = await storeServices.fetchStore(id);
        convertAllImagePathsToURLs(req.protocol, req.hostname, store);
        res.json(store);
    }catch(err)
    {
        res.status(400).send('Error fetching store ' + err.message);
    }
}

const fetchOwnedStore = async (req, res) =>{
    const { decodedAuthToken } = req;
    try
    {
        const store = await storeServices.fetchStoreOfUser(decodedAuthToken.id);
        convertAllImagePathsToURLs(req.protocol, req.hostname, store);
        res.json(store);
    }catch(err)
    {
        res.status(400).send('Error fetching owned store ' + err.message);
    }
}

const createStore = async (req, res) =>
{
    const {decodedAuthToken, files, body} = req;
    try
    {
        const result = await storeServices.createStore(body, files, decodedAuthToken);
        logger.info('Created Store by User ', decodedAuthToken.id, '. Result: ', result);
        res.json(result);
    }catch(err)
    {
        res.status(400).send('Error creating store ' + err.message);
    }
}

const updateStore = async (req, res) => 
{
    const {decodedAuthToken, files, body} = req;
    try
    {
        const result = await storeServices.updateStore(body, files, decodedAuthToken);
        res.json(result);
    }catch(err)
    {
        res.status(400).send('Error updating store ' + err.message);
    }
}

export default  { fetchStore, fetchOwnedStore, createStore, updateStore }