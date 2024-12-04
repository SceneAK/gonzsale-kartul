import connectionPromise from './db.js';
const connection = await connectionPromise;

async function processTransaction(totalAmount, proofRelPath)
{
    const result = await connection.execute('INSERT INTO transaction (transaction_date, transaction_amount) VALUES (?,?,?)', [
        totalAmount, 
        proofRelPath
    ]);
    return result.insertedId;
}

export default processTransaction;