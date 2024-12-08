import express from 'express';
const router = express.Router();

import { verifyAuthToken_mid } from '../modules/tokenAuth.js';
import { getOrders, placeOrderAccount, placeOrderGuest } from '../controllers/order.js'
import { createMulter } from '../modules/upload.js';

const transactionUpload = createMulter({relativeDir: 'Transactions', keyName: 'transaction_proof', isArray: false})
router.use('/get/', verifyAuthToken_mid, getOrders);
router.use('/place/', verifyAuthToken_mid, transactionUpload, placeOrderAccount);
router.use('/guest/place/', transactionUpload, placeOrderGuest);

export default router;