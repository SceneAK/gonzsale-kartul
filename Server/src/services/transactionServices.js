import databaseInitializePromise from '../database/initialize.js';
const { Transaction } = await databaseInitializePromise;

const ATTRIBUTES = ['id', 'orderId', 'method', 'type', 'createdAt']
async function createTransaction(orderId, method, type)
{
    const transactionModel = await Transaction.create({orderId, method, type});
    return transactionModel.toJSON();
}

async function fetchTransaction(id, options = {})
{
    const transactionModel = await Transaction.findByPk(id, { attributes: ATTRIBUTES, ...options });
    return transactionModel.toJSON();
}

function include(level)
{
    switch (level) {
        case 'serve':
            return {
                model: Transaction,
                attributes: ['id', 'method', 'type', 'createdAt']
            }
        default:
            return { model: Transaction }
    }
}
export default {
    createTransaction,
    fetchTransaction,
    include
};