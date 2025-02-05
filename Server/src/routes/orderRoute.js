import express from 'express';
const router = express.Router();

import { verify, validatePassReq, validate} from '../middlewares/index.js';
import { orderSchemas, page } from '../reqSchemas/index.js';
import { order } from '../controllers/index.js'
import orderItemRoute from './orderItemRoute.js'

router.get('/incoming', verify(), validate(page), order.fetchIncomingOrders);

router.get('/my', verify(), validate(page), order.fetchOrders);

router.get('/:id', order.fetchOrder);

router.post('/', verify(false), validatePassReq(orderSchemas.createOrder), order.createOrder);

router.use('/item', orderItemRoute);

export default router;