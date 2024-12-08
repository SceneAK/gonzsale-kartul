import express from 'express';
const router = express.Router();

import { verifyUser } from '../modules/tokenAuth.js';
import { validate, orderSchemas} from '../reqSchemas/index.js';
import { order } from '../controllers/index.js'
import { createMulter } from '../modules/upload.js';

const transactionUpload = createMulter({relativeDir: 'Transactions', keyName: 'transaction_proof', isArray: false})

router.use('/get/', verifyUser, order.getOrders);

router.use('/place/', verifyUser, transactionUpload, validate(orderSchemas.placeOrder), order.placeOrderAccount);

router.use('/guest/place/', transactionUpload, validate(orderSchemas.placeOrder), validate(orderSchemas.guestExtra), order.placeOrderGuest);

export default router;