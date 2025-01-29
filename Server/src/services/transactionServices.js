import databaseInitializePromise from '../database/initialize.js';
import orderServices from './orderServices.js';
const { Transaction } = await databaseInitializePromise;

const ATTRIBUTES = ['id', 'orderId', 'method', 'type', 'createdAt']
async function createTransaction(transactionData)
{
    const {orderId, amount, method, type} = transactionData;
    await ensureNotExists(orderId, method);

    if(type === 'PAYMENT') 
    {
        amount = await orderServices.calculateOrderTotal(orderId);
    }
    
    const transactionModel = await Transaction.create({orderId, amount, method, type});
    return transactionModel.toJSON();
}
async function ensureNotExists(orderId, method)
{
    const exists = await methodExists(orderId, method);
    if(exists) throw new ApplicationError(`${method} already exists for order ${orderId}`, 400);
}
async function methodExists(orderId, method)
{
    const createdTransactions = await Transaction.findAll({ where: { orderId, method } });
    return createdTransactions.length > 0;
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