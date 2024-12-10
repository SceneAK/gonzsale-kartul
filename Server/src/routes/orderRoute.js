import express from 'express';
const router = express.Router();

import { verifyUser } from '../modules/tokenAuth.js';
import { validate, orderSchemas} from '../reqSchemas/index.js';
import { order } from '../controllers/index.js'
import { createMulter } from '../modules/upload.js';

const transactionUpload = createMulter({relativeDir: 'Transactions', keyName: 'transaction_proof', type: 'array'})

router.get('/incoming/', verifyUser, order.getIncomingOrders);

router.get('/', verifyUser, order.getOrders);

router.post('/', verifyUser, transactionUpload, validate(orderSchemas.placeOrder), order.placeOrderAccount);

router.post('/guest/', transactionUpload, validate(orderSchemas.guestPlace), order.placeOrderGuest);

router.patch('/', verifyUser, validate(orderSchemas.update), order.updateOrderStatus)

export default router;