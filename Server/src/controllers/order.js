import transaction from './transaction.js';
import connectionPromise from '../modules/db.js';
import { getRelative, unlink, updateUsed } from '../modules/upload.js';
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
    const { authUser } = req; 

    try {
        const store = await getStoreOwnedBy(authUser.id);
        let query = '';
        let params = [];

        if (store != null) {
            query = "SELECT o.*, p.store_id FROM `order` o INNER JOIN product p ON o.product_id = p.product_id WHERE p.store_id = ? OR o.customer_user_id = ?";
            params = [store.store_id, authUser.id];
        } else {
            query = "SELECT * FROM `order` WHERE customer_user_id = ?";
            params = [authUser.id];
        }

        const [rows] = await connection.execute(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).send(err);
    }
};


async function placeOrder(customer_id, req, res)
{
    try
    {
        const {product_id, order_qty, order_variant, order_notes} = req.body; 

        const [rows] = await connection.execute("SELECT product_canOrder, product_price FROM product WHERE product_id = ?", [product_id]);
        if(rows.length == 0){
            res.status(400).send('Product Does Not Exist'); return;
        }
        if(!rows[0].product_canOrder){
            res.status(400).send('Product Unavailable for Order'); return;
        }
        
        const relProofPath = getRelative(req.file.path);
        const total = rows[0].product_price * order_qty;
        const transactionId = await transaction.recordTransaction(total, relProofPath);
        
        const parsed = JSON.parse(order_variant);

        const [result] = await connection.execute('INSERT INTO `order` (product_id, customer_user_id, order_qty, order_variant, order_notes, transaction_id) VALUES (?, ?, ?, ?, ?, ?)', [
            product_id,
            customer_id,
            order_qty,
            parsed,
            order_notes,
            transactionId
        ])

        updateUsed([req.file], customer_id);
        const insertId = result.insertId;
        res.json({insertId});
    }catch(err) {
        if(req.file != undefined) unlink([req.file]);
        res.status(400).send(err.message);
    }
}


const placeOrderAccount = async(req, res) => {
    placeOrder(req.authUser.id, req, res);
}

const placeOrderGuest = async (req, res) => {
    const {user_phone, user_email} = req.body;
    const [result] = await connection.execute(
        'INSERT INTO users (email, password) VALUES (?, ?, NULL) ON DUPLICATE KEY UPDATE user_id = LAST_INSERT_ID(user_id)',
        [user_phone, user_email]
    );
    const guestAccountid = result.insertId; 

    placeOrder(guestAccountid, req, res);
}

const updateOrderStatus = async (req, res) => {
    const {authUser, body} = req;

    const store = getStoreOwnedBy(authUser.id);
    if(store == null){ 
        res.status(401); return;
    }

    const [rows] = await connection.execute('SELECT p.store_id FROM `order` o INNER JOIN product p ON o.product_id = p.product_id WHERE o.order_id = ?', [body.order_id]);
    const storeOwnsProduct = rows[0].store_id == store.store_id;
    if(!storeOwnsProduct){ 
        res.status(401); return;
    }
    
    try
    {
        const { order_status, order_id} = body;
        await connection.execute('UPDATE order SET order_status = ? WHERE order_id = ?', [order_status, order_id]);
        res.status(204);
    }catch(err)
    {
        res.status(500);
    }
    
}


export default {getOrders, placeOrderGuest, placeOrderAccount, updateOrderStatus}