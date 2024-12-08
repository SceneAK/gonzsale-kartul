import express from 'express';
import { verifyUser } from '../modules/tokenAuth.js';
import { transaction } from '../controllers/index.js';
const router = express.Router();

router.get('/:id', verifyUser, transaction.getTransaction);

export default router;