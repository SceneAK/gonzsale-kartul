import express from 'express';
const router = express.Router();

import verify from '../middlewares/verifyAuthToken.js';
import { validate, orderSchemas} from '../reqSchemas/index.js';
import { order } from '../controllers/index.js'

router.get('/incoming', verify, order.fetchIncomingOrders);

router.get('/my', verify, order.fetchOrders);

router.get('/:id', order.fetchOrder);

router.post('/', verify, validate(orderSchemas.createOrder), order.createOrder);

router.patch('/', verify, validate(orderSchemas.update), order.updateOrderStatus)

export default router;