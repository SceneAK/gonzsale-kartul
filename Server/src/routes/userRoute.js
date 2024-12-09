import { user } from '../controllers/index.js';
import { validate, userSchemas } from '../reqSchemas/index.js'
import express from 'express';
const router = express.Router();

router.post('/signin/', validate(userSchemas.signIn), user.signIn);

router.post('/signup/', validate(userSchemas.signUp), user.signUp);

export default router;