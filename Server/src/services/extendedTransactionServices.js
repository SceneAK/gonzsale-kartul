import transactionServices from './transactionServices.js';
import proofTransactionServices from './proofTransactionServices.js';
import ApplicationError from '../common/errors.js';
import { getInstance } from '../database/sequelize.js';
const sequelize = getInstance();

async function createTransaction(transactionData, method, userId)
{
    const extService = getExtensionForTransactionMethod(method);

    let combined;
    await sequelize.transaction(async t => {
        const transaction = await transactionServices.createTransaction( { ...transactionData, method } );
        const extTransaction = await extService.create(transactionData, transaction.id, userId);
        
        delete extTransaction.transactionId;
        combined = { ...transaction, ...extTransaction};
    })
    return combined;
}

async function fetchTransaction(id)
{
    const transaction = await transactionServices.fetchTransaction(id);
    const extService = getExtensionForTransactionMethod(transaction.method);

    const extTransaction = await extService.fetch(transaction.id);

    delete extTransaction.transactionId;
    return { ...transaction, ...extTransaction};
}

const extensions = {}
extensions['PROOF-BASED'] = {
    create: async (transactionData, transactionId, userId) => {
        return await proofTransactionServices.createProofTransaction(transactionData.file, transactionId, userId)
    },
    fetch: proofTransactionServices.fetchProofTransaction
};
extensions['CASH-ON-DELIVERY'] = {
    create: _ => {return {};},
    fetch: _ => {return {};}
};
function getExtensionForTransactionMethod(method)
{
    const service = extensions[method];
    if(!service) throw new ApplicationError("Invalid Transaction Method", 400);
    return service;
}

export default {
    createTransaction,
    fetchTransaction
};
