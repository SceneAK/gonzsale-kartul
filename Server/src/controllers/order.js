import { v4 } from 'uuid';
import transaction from './transaction.js';
import connectionPromise from '../modules/db.js';
import { getRelative, unlink, updateUsed } from '../modules/upload.js';
const connection = await connectionPromise;


async function getStoreOwnedBy(user_id) {
    try {
        const [rows] = await connection.execute('SELECT * FROM stores WHERE owner_user_id = ?', [user_id]);
        return rows.length == 0 ? null : rows[0];
    } catch (error) { throw error; }
}
const getIncomingOrders = async (req, res) => {
    const { authUser } = req; 
    try {
        const store = await getStoreOwnedBy(authUser.id);

        if (store == null) return res.status(401).send("No Store Owned");

        const [rows] = await connection.execute("SELECT o.*, u.user_name, u.user_email, u.user_phone FROM orders o INNER JOIN products p ON o.product_id = p.product_id INNER JOIN users u ON u.user_id = o.customer_user_id WHERE p.store_id = ?", [
            store.store_id
        ]);
        
        res.json(rows.map( row => {
            const {user_name, user_email, user_phone, ...rest} = row;
            return {...rest, customer: {user_name, user_email, user_phone} }
        }));
    } catch (err) {
        res.status(500).send(err);
    }
}

const getOrders = async (req, res) => {
    const { authUser } = req; 
    try {
        const [rows] = await connection.execute("SELECT * FROM orders WHERE customer_user_id = ?", [authUser.id]);
        rows.forEach(row => delete row.customer_user_id );
        res.json(rows);
    } catch (err) {
        res.status(500).send("ERR"+err);
    }
};


async function placeOrder(customer_id, req, res)
{
    try
    {
        const {product_id, order_qty, order_variant, order_notes} = req.body; 

        const [rows] = await connection.execute("SELECT product_availability, product_price FROM products WHERE product_id = ?", [product_id]);
        if(rows.length == 0){
            res.status(400).send('Product Does Not Exist'); return;
        }
        if(rows[0].product_availability == 'UNAVAILABLE'){
            res.status(400).send('Product Unavailable for Order'); return;
        }
        
        const relProofPath = getRelative(req.file.path);
        const total = rows[0].product_price * order_qty;
        const transactionId = await transaction.recordTransaction(total, relProofPath);
        
        const parsed = JSON.parse(order_variant);

        const order_id = v4();
        await connection.execute('INSERT INTO orders (order_id, product_id, customer_user_id, order_qty, order_variant, order_notes, transaction_id) VALUES (?, ?, ?, ?, ?, ?, ?)', [
            order_id,
            product_id,
            customer_id,
            order_qty,
            parsed,
            order_notes,
            transactionId
        ])

        updateUsed([req.file], customer_id);
        res.json({order_id});
    }catch(err) {
        if(req.file != undefined) unlink([req.file]);
        res.status(400).send(err.message);
    }
}


const placeOrderAccount = async(req, res) => {
    placeOrder(req.authUser.id, req, res);
}

const placeOrderGuest = async (req, res) => {
    const {user_phone, user_name, user_email} = req.body;
    const [rows] = await connection.execute('SELECT * FROM users WHERE user_email = ?', [user_email]);
    let user_id;
    if(rows.length != 0)
    {
        user_id = rows[0].user_id;
        connection.execute('UPDATE users SET user_phone = ?, user_name = ? WHERE user_email = ?', [user_phone, user_name, user_email]);
    }else{
        user_id = v4();
        await connection.execute(
            'INSERT INTO users (user_id, user_name, user_phone, user_email, user_password) VALUES (?, ?, ?, ?, NULL)',
            [user_id, user_name, user_phone, user_email]
    );
    }

    placeOrder(user_id, req, res);
}

const updateOrderStatus = async (req, res) => {
    const {authUser, body} = req;

    const store = await getStoreOwnedBy(authUser.id);
    if(store == null){ 
        res.status(401).send("No Owned Store"); return;
    }

    const [rows] = await connection.execute('SELECT p.store_id FROM orders o INNER JOIN products p ON o.product_id = p.product_id WHERE o.order_id = ?', [body.order_id]);

    const storeOwnsProduct = rows[0].store_id == store.store_id;
    if(!storeOwnsProduct){ 
        res.status(401).send("Order's Product Does Not Belong To Store"); return;
    }
    
    try
    {
        const { order_status, order_id} = body;
        await connection.execute('UPDATE orders SET order_status = ? WHERE order_id = ?', [order_status, order_id]);
        res.status(204).send("");
    }catch(err)
    {
        res.status(500).send(err.message);
    }
    
}


export default {getOrders, getIncomingOrders, placeOrderGuest, placeOrderAccount, updateOrderStatus}