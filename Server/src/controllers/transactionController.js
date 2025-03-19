import { convertAllPathsToURLs } from "../common/index.js";
import { extendedTransactionServices } from "../services/index.js";

const fetchTransaction = async (req, res)=> {
    const {id} = req.params;
    const result = await extendedTransactionServices.fetchTransaction(id);
    convertAllPathsToURLs(req, result);
    res.json(result || {});
}

const createCODTransaction = async(req, res) => {
    const body = {...req.body, orderId: req.params.orderId};
    const result = await extendedTransactionServices.createTransaction(body, 'CASH-ON-DELIVERY', req.authJwt?.id)
    res.json(result || {});
}
const createProofTransaction = async(req, res) => {
    const bodyAndFile = {...req.body, file: req.file, orderId: req.params.orderId};
    const result = await extendedTransactionServices.createTransaction(bodyAndFile, 'PROOF-BASED', req.authJwt?.id)
    res.json(result || {});
}

export default {
    fetchTransaction,
    createProofTransaction,
    createCODTransaction
};