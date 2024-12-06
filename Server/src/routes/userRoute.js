import { user } from '../controllers';
import {validateBody, userSchemas } from '../schemas'
import express from 'express';
const router = express.Router();

router.post('/signIn/', validateBody(userSchemas.signIn), user.signIn);

router.post('/signUp/', validateBody(userSchemas.signUp), user.signUp);

export default router;