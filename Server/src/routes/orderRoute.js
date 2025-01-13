import express from 'express';
const router = express.Router();

import verify from '../middlewares/verifyAuthToken.js';
import { validate, orderSchemas} from '../reqSchemas/index.js';
import { order } from '../controllers/index.js'
import {createMulter} from '../middlewares/multerUploads.js';

const transactionUpload = createMulter({relativeDir: 'Transactions', keyName: 'transaction_proof', type: 'single'})

router.get('/incoming', verify, order.getIncomingOrders);

router.get('/', verify, order.getOrders);

router.post('/', verify, transactionUpload, validate(orderSchemas.placeOrder), order.placeOrderAccount);

router.post('/guest', transactionUpload, validate(orderSchemas.guestPlace), order.placeOrderGuest);

router.patch('/', verify, validate(orderSchemas.update), order.updateOrderStatus)

export default router;