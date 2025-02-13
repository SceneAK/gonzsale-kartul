import express from 'express';
const router = express.Router();

import { verify, validate, ensureStore } from '../middlewares/index.js';
import { orderItemSchemas } from '../reqSchemas/index.js';
import { orderItem } from '../controllers/index.js'

router.patch('/:id/status', verify(), ensureStore, validate(orderItemSchemas.update), orderItem.updateStatus);

router.patch('/by-variant/:variantId/status', verify(), ensureStore, validate(orderItemSchemas.update), orderItem.updateStatusByVariant);

export default router;