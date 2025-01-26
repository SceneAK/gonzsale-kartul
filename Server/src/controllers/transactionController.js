import { convertAllPathsToURLs } from "../common/pathToURLConverter.js";
import { extendedTransactionServices } from "../services/index.js";

const fetchTransaction = async (req, res)=> {
    const {id} = req.params;
    const result = await extendedTransactionServices.fetchTransaction(id);
    convertAllPathsToURLs(req.protocol, req.hostname, result);
    res.json(result);
}

const createCODTransaction = async(req, res) => {
    await extendedTransactionServices.createTransaction(req.body, 'CASH-ON-DELIVERY', req.decodedAuthToken.id)
    res.json({result: 'created'});
}
const createProofTransaction = async(req, res) => {
    const transactionData = {...req.body, file: req.file};
    await extendedTransactionServices.createTransaction(transactionData, 'PROOF-BASED', req.decodedAuthToken.id)
    res.json({result: 'created'});
}

export default {
    fetchTransaction,
    createProofTransaction,
    createCODTransaction
};