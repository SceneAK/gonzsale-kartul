import connectionPromise from './db';
const connection = await connectionPromise;

async function processTransaction(details)
{
    const result = await connection.execute('INSERT INTO transaction (transaction_date, transaction_amount, payment_method) VALUES (?,?,?)', [
        details.amount,
        details.method
    ]);
    
    return result.insertedId;
}

export default processTransaction;