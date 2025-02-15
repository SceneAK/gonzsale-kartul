import express from 'express';
const router = express.Router();

import { verify, validate, ensureStore } from '../middlewares/index.js';
import { orderItemSchemas } from '../reqSchemas/index.js';
import { orderItem } from '../controllers/index.js'

router.patch('/:id/status/:status', verify(), ensureStore, orderItem.updateStatus);

router.patch('/status/:status', verify(), ensureStore, validate(orderItemSchemas.whereQuery), orderItem.updateStatusWhere);

export default router;