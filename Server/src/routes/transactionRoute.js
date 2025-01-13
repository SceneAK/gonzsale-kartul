import express from 'express';
import verify from '../middlewares/verifyAuthToken.js';
import { transaction } from '../controllers/index.js';
const router = express.Router();

router.get('/:transaction_id', verify, transaction.getTransaction);

export default router;