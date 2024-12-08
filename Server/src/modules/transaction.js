import connectionPromise from './db.js';
import { v4 } from 'uuid';
const connection = await connectionPromise;

function getCurrentDateMYSQLFormatted()
{
    const currentDate = new Date(); 
    return currentDate.toISOString().slice(0, 19).replace('T', ' ');
}
async function processTransaction(totalAmount, proofRelPath)
{
    const id = v4();
    const dateStr = getCurrentDateMYSQLFormatted();
    try
    {
        await connection.execute('INSERT INTO transaction (transaction_id, transaction_date, transaction_amount, transaction_proof) VALUES (?,?,?,?)', [
            id,
            dateStr,
            totalAmount, 
            proofRelPath
        ]);
        return id;
    }catch(err) { throw err;}
}

export default processTransaction;