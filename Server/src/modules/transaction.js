import connectionPromise from './db.js';
const connection = await connectionPromise;

async function processTransaction(totalAmount, payment_method, proof)
{
    const result = await connection.execute('INSERT INTO transaction (transaction_date, transaction_amount, payment_method) VALUES (?,?,?)', [
        payment_method, 
        totalAmount, 
        proof
    ]);
    
    return result.insertedId;
}

export default processTransaction;