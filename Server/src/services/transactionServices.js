import ApplicationError from '../common/errors.js';
import databaseInitializePromise from '../database/initialize.js';
import orderServices from './orderServices.js';
import storeServices from './storeServices.js';
const { Transaction } = await databaseInitializePromise;

const ATTRIBUTES = ['id', 'orderId', 'method', 'amount', 'type', 'createdAt']

async function fetchTransaction(id, options = {})
{
    const transactionModel = await Transaction.findByPk(id, { attributes: ATTRIBUTES, ...options });
    return transactionModel.toJSON();
}

async function createTransaction(createData, requesterId)
{
    await validateCreateData(createData, requesterId);

    const transactionModel = await Transaction.create(createData);
    return transactionModel.toJSON();
}
async function validateCreateData(createData, requesterId)
{
    const {orderId, type} = createData;

    const existingTransactions = await Transaction.findAll({ where: { orderId } });
    const associatedOrder = await orderServices.fetchOrder(orderId);
    
    if(findType(existingTransactions, type)) throw new ApplicationError(`${type} transaction already exists for this order`, 400);
    if(type === 'PAYMENT') 
    {
        if(associatedOrder.customerId !== requesterId) throw new ApplicationError(`Only the customer can make PAYMENT transactions`, 400);
        createData.amount = await orderServices.calculateOrderTotal(orderId);
    }else{
        const storeId = await storeServices.fetchStoreIdOfUser(requesterId);
        if(associatedOrder.storeId != storeId) throw new ApplicationError(`Only the store of this order can make REFUND transactions`, 400);
        if(!findType(existingTransactions, "PAYMENT")) throw new ApplicationError(`REFUNDs must be preceeded by a PAYMENT transaction by the customer`, 400);
    }
}

function findType(transactions, type)
{
    return transactions.find(transaction => transaction.type === type);
}

function include(level)
{
    switch (level) {
        case 'serve':
            return {
                model: Transaction,
                attributes: ATTRIBUTES
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