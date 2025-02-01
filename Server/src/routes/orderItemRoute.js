import express from 'express';
const router = express.Router();

import verify from '../middlewares/verifyAuthToken.js';
import { validate, orderItemSchemas } from '../reqSchemas/index.js';
import { orderItem } from '../controllers/index.js'

router.patch('/:id/status', verify, validate(orderItemSchemas.update), orderItem.updateStatus);

router.patch('/by-product/:productId/status', verify, validate(orderItemSchemas.update), orderItem.updateStatusByProduct);

export default router;