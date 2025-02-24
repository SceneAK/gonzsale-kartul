import express from 'express';
const router = express.Router();

import { verify, validatePassReq, validate, ensureStore, verifyReCAPTCHA} from '../middlewares/index.js';
import { orderSchemas, page } from '../reqSchemas/index.js';
import { order } from '../controllers/index.js'
import orderItemRoute from './orderItemRoute.js'

router.get('/incoming', verify(), ensureStore, validate(orderSchemas.fetchIncoming), order.fetchIncomingOrders);

router.get('/my', verify(), validate(page), order.fetchOrders);

router.get('/:id', order.fetchOrder);

router.post('/', verify(false), verifyReCAPTCHA, validatePassReq(orderSchemas.createOrders), order.createOrders);

router.delete('/:id', verify(), ensureStore, order.deleteOrder);

router.use('/item', orderItemRoute);

export default router;