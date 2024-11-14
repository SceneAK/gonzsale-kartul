import processTransaction from '../modules/transaction.js';
import connectionPromise from '../modules/db.js'
const connection = await connectionPromise;


async function getStoreOwnedBy(user_id) {
    try {
        const [rows] = await connection.execute('SELECT * FROM store WHERE owner_user_id = ?', [user_id]);
        return rows.length == 0 ? null : rows[0];
    } catch (error) {
        console.error('Error fetching store:', error);
        throw error;
    }
}

const getOrders = async (req, res) => {
    const { authenticatedUserId } = req;

    try {
        const store = await getStoreOwnedBy(authenticatedUserId);
        let query = '';
        let params = [];

        if (store != null) {
            query = 'SELECT o.*, p.store_id FROM `order` o INNER JOIN product p ON o.product_id = p.product_id WHERE p.store_id = ? OR o.customer_user_id = ?';
            params = [store.store_id, authenticatedUserId];
        } else {
            query = 'SELECT * FROM `order` WHERE customer_user_id = ?';
            params = [authenticatedUserId];
        }

        const [rows] = await connection.execute(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500);
    }
};


const placeOrder = async (req, res) => {
    try
    {
        const transactionId = processTransaction(req.body.transactionDetail);
        const orderDetail = req.body.orderDetail;
        const result = await connection.execute('INSERT INTO order (product_id, customer_user_id, order_qty, order_variant, transaction_id) VALUES (?, ?, ?, ?, ?)', [
            orderDetail.product_id,
            orderDetail.customer_user_id,
            orderDetail.order_qty,
            orderDetail.order_variant,
            transactionId
        ])
        res.json(result.insertedId);
    }catch(err){
        res.status(400).send(err);
    }
}

const updateOrderStatus = async (req, res) => { // which order to update, to what status. 
    const {authenticatedUserId, body} = req;
    const store = getStoreOwnedBy(authenticatedUserId);
    if(store == null){ res.status(401); return;} // user has no store

    const [rows] = await connection.execute('SELECT p.store_id FROM `order` o INNER JOIN product p ON o.product_id = p.product_id WHERE o.order_id = ?', [body.order_id]);
    if(rows[0].store_id != store.store_id){ res.status(401); return;} // order has no correlation with user's store
    
    await connection.execute('UPDATE order SET order_status = ? WHERE order_id = ?', [body.order_status, body.order_id]);
    res.status(204);
}


export {getOrders, placeOrder, updateOrderStatus}

// get order
// place order