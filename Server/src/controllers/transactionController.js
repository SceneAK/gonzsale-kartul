import { convertAllPathsToURLs } from "../common/pathToURLConverter.js";
import { extendedTransactionServices } from "../services/index.js";

const fetchTransaction = async (req, res)=> {
    const {id} = req.params;
    const result = await extendedTransactionServices.fetchTransaction(id);
    convertAllPathsToURLs(req.protocol, req.hostname, result);
    res.json(result);
}

const createCODTransaction = async(req, res) => {
    const body = {...req.body, orderId: req.params.orderId};
    await extendedTransactionServices.createTransaction(body, 'CASH-ON-DELIVERY', req.decodedAuthToken.id)
    res.json({result: 'created'});
}
const createProofTransaction = async(req, res) => {
    const bodyAndFile = {...req.body, file: req.file, orderId: req.params.orderId};
    await extendedTransactionServices.createTransaction(bodyAndFile, 'PROOF-BASED', req.decodedAuthToken.id)
    res.json({result: 'created'});
}

export default {
    fetchTransaction,
    createProofTransaction,
    createCODTransaction
};