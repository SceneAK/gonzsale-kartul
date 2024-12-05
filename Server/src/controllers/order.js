import recordTransaction from '../modules/transaction.js';
import connectionPromise from '../modules/db.js'
import { verifyAuthToken, getCleanAuthToken } from '../modules/tokenAuth.js';
import { formatAndRegexCheck } from '../modules/userDataValidator.js';
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
    const { authenticatedUserId } = req; 

    try {
        const store = await getStoreOwnedBy(authenticatedUserId);
        let query = '';
        let params = [];

        if (store != null) {
            query = "SELECT o.*, p.store_id FROM `order` o INNER JOIN product p ON o.product_id = p.product_id WHERE p.store_id = ? OR o.customer_user_id = ?";
            params = [store.store_id, authenticatedUserId];
        } else {
            query = "SELECT * FROM `order` WHERE customer_user_id = ?";
            params = [authenticatedUserId];
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
        const {product_id, order_qty, order_variant} = req.body; 
        if(req.file == undefined || product_id == undefined || order_qty == undefined || order_variant == undefined) {
            res.status(400).send('Incomplete Order Details'); return;
        }
        
        const [rows] = await connection.execute("SELECT product_canOrder, product_price FROM product WHERE product_id = ?", [product_id]);
        if(rows.length == 0){
            res.status(400).send('Product Does Not Exist'); return;
        }
        if(!rows[0].product_canOrder){
            res.status(400).send('Product Unavailable for Order'); return;
        }
        
        const relProofPath = getRelative(req.file.path);
        const total = rows[0].product_price * order_qty;
        const transactionId = await recordTransaction(total, relProofPath);

        const [result] = await connection.execute('INSERT INTO `order` (product_id, customer_user_id, order_qty, order_variant, transaction_id) VALUES (?, ?, ?, ?, ?)', [
            product_id,
            customer_id,
            order_qty,
            order_variant,
            transactionId
        ])

        updateUsed([req.file], customer_id);
        const insertId = result.insertId;
        res.json({insertId});
    }catch(err) {
        if(req.file != undefined) unlink([req.file]);
        res.status(400).send("ERR:\n" + err);
    }
}


const placeOrderAccount = async(req, res) => {
    const token = getCleanAuthToken(req);
    const {id: customer_id} = await verifyAuthToken(token);
    placeOrder(customer_id, req, res);
}

function validCustomerDetail(body){
    const { email } = body;
    return email =! undefined && formatAndRegexCheck(email);
}
const placeOrderGuest = async (req, res) => {
    if(!validCustomerDetail(req.body)) {
        res.status(400).send("Incorrect customer details");return;
    }

    // create guest account
    const [result] = await connection.execute(
        'INSERT INTO users (email, password) VALUES (?, ?, NULL) ON DUPLICATE KEY UPDATE user_id=LAST_INSERT_ID(user_id)',
        [user_phone, user_email]
    );
    const customer_id = result.insertedId; // guest account ID

    placeOrder(customer_id, req, res);
}

const updateOrderStatus = async (req, res) => {
    const {authenticatedUserId, body} = req;

    const store = getStoreOwnedBy(authenticatedUserId);
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


export {getOrders, placeOrderGuest, placeOrderAccount, updateOrderStatus}