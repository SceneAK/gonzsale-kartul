import express from 'express';
import { verifyAuthToken_mid } from '../modules/tokenAuth';
import { getTransaction } from '../controllers/transaction';
const router = express.Router();

router.get('/:id', verifyAuthToken_mid, getTransaction);

export default router;