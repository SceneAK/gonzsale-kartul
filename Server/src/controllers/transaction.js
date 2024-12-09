import { v4 } from 'uuid';
import connectionPromise from '../modules/db.js';
const connection = await connectionPromise;

function getCurrentDateMYSQLFormatted()
{
    const currentDate = new Date(); 
    return currentDate.toISOString().slice(0, 19).replace('T', ' ');
}
async function recordTransaction(totalAmount, proofRelPath)
{
    const id = v4();
    const dateStr = getCurrentDateMYSQLFormatted();
    try
    {
        await connection.execute('INSERT INTO transactions (transaction_id, transaction_date, transaction_amount, transaction_proof) VALUES (?,?,?,?)', [
            id,
            dateStr,
            totalAmount, 
            proofRelPath
        ]);
        return id;
    }catch(err) { throw err;}
}

const getTransaction = async (req, res)=> {
    const {transaction_id} = req.params;
    const getTransactionIfRelatedToUser =
        'SELECT t.* FROM transactions t INNER JOIN orders o ON t.transaction_id = o.transaction_id INNER JOIN products p ON o.product_id = p.product_id INNER JOIN stores s ON p.store_id = s.store_id WHERE t.transaction_id = ? AND (o.customer_user_id = ? OR s.owner_user_id = ?)';
    
    const [rows] = await connection.execute(getTransactionIfRelatedToUser, [
        transaction_id,
        req.authUser.id,
        req.authUser.id
    ]);
    if(rows.length == 0)
    {
        res.status(400).send('Cannot Access Such Transaction'); return;
    }
    res.json(rows[0]);
}

export default {
    recordTransaction,
    getTransaction
};