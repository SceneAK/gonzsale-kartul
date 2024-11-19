import express from 'express';
const router = express.Router();

import { verifyAuthToken_mid } from '../modules/tokenAuth.js';
import { getOrders, placeOrderAccount, placeOrderGuest } from '../controllers/order.js'

router.use('/', getOrders);
router.use('/place/', verifyAuthToken_mid, placeOrderAccount);
router.use('/guest/place/', placeOrderGuest);

export default router;