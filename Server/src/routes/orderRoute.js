import express from 'express';
const router = express.Router();

import { populateAuthJwt, validatePassReq, validate, ensureIsStore, ensureAdminOr, verifyReCAPTCHA, ensureIsUser} from '../middlewares/index.js';
import { orderSchemas, page } from '../reqSchemas/index.js';
import { order } from '../controllers/index.js'
import orderItemRoute from './orderItemRoute.js'

router.get('/store/:storeId', populateAuthJwt(), ensureAdminOr(ensureIsStore('storeId')), validate(orderSchemas.fetchForStore), order.fetchOrdersForStore);

router.get('/user/:userId', populateAuthJwt(), ensureAdminOr(ensureIsUser('userId')), validate(page), order.fetchOrdersOfUser);

router.get('/:id', order.fetchOrder);

router.post('/', populateAuthJwt({required: false}), verifyReCAPTCHA, validatePassReq(orderSchemas.createOrders), order.createOrders);

router.delete('/:id', populateAuthJwt(), ensureIsStore(), order.deleteOrder);

router.use('/item', orderItemRoute);

export default router;