import express from 'express';
const router = express.Router();

import { verify, validate } from '../middlewares/index.js';
import { orderItemSchemas } from '../reqSchemas/index.js';
import { orderItem } from '../controllers/index.js'

router.patch('/:id/status', verify(), validate(orderItemSchemas.update), orderItem.updateStatus);

router.patch('/by-product/:productId/status', verify(), validate(orderItemSchemas.update), orderItem.updateStatusByProduct);

export default router;