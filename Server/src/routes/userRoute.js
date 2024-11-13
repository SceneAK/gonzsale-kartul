import { signIn, signUp } from '../controllers/user.js';
import express from 'express';
const router = express.Router();

// general
router.post('/signIn/', signIn);

// single
router.post('/signUp/', signUp);

export default router;