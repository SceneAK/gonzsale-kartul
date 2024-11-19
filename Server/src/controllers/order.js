import processTransaction from '../modules/transaction.js';
import connectionPromise from '../modules/db.js'
import { verifyAuthToken, getCleanAuthToken } from '../modules/tokenAuth.js';
import { formatAndRegexCheck } from '../modules/userDataValidator.js';
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

async function canOrder(productId)
{
    const [rows] = await connection.execute("SELECT product_canOrder FROM product WHERE product_id = ?", [productId]);
    if(rows.length == 0) { throw new Error('invalid product_id');}
    
    return rows[0].product_canOrder;
}
async function placeOrder(customer_id, body, res)
{
    try
    {
        const {transactionDetail, product_id, order_qty, order_variant} = body; 
        if(!canOrder(product_id)){res.send('Product Unavailable for Order'); return;}

        const transactionId = processTransaction(transactionDetail);
        const result = await connection.execute('INSERT INTO order (product_id, customer_user_id, order_qty, order_variant, transaction_id) VALUES (?, ?, ?, ?, ?)', [
            product_id,
            customer_id,
            order_qty,
            order_variant,
            transactionId
        ])
        const insertedId = result.insertedId;
        res.json({insertedId});
    }catch(err) {res.status(400).send(err);}
}


const placeOrderAccount = async(req, res) => {
    const token = getCleanAuthToken(req);
    const customer_id = await verifyAuthToken(token);
    placeOrder(customer_id, req.body, res);
}

function validCustomerDetail(body)
{
    const { email } = body;
    if(email == undefined) return false;

    return formatAndRegexCheck(email);
}
const placeOrderGuest = async (req, res) => {
    
    if(!validCustomerDetail(req.body)) {res.status(400).send("Incorrect customer details");return;}

    // create new user or get user with email.
    const [result] = await connection.execute(
        'INSERT INTO users (email, password) VALUES (?, ?, NULL) ON DUPLICATE KEY UPDATE user_id=LAST_INSERT_ID(user_id)',
        [user_phone, user_email]
    );
    const customer_id = result.insertedId;
    placeOrder(customer_id, req.body, res);
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


export {getOrders, placeOrderGuest, placeOrderAccount, updateOrderStatus}