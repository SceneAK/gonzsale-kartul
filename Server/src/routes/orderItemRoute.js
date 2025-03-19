import express from 'express';
const router = express.Router();

import { populateAuthJwt, validate, ensureIsStore } from '../middlewares/index.js';
import { orderItemSchemas } from '../reqSchemas/index.js';
import { orderItem } from '../controllers/index.js'

router.patch('/:id/status/:status', populateAuthJwt(), ensureIsStore(), orderItem.updateStatus);

router.patch('/status/:status', populateAuthJwt(), ensureIsStore(), validate(orderItemSchemas.filterQuery), orderItem.bulkUpdateStatus);

export default router;