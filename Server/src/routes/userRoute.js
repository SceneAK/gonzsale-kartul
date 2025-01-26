import { user } from '../controllers/index.js';
import { verify } from '../middlewares/index.js';
import { validate, userSchemas } from '../reqSchemas/index.js'
import express from 'express';
const router = express.Router();

router.post('/signin', validate(userSchemas.signIn), user.signIn);

router.post('/signup', validate(userSchemas.signUp), user.signUp);

router.post('/refresh', verify, user.refresh);

export default router;