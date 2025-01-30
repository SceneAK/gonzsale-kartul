import { user } from '../controllers/index.js';
import { verify } from '../middlewares/index.js';
import { validate, userSchemas } from '../reqSchemas/index.js'
import express from 'express';
const router = express.Router();

router.post('/signin', validate(userSchemas.signIn), user.signIn);

router.post('/signup', validate(userSchemas.signUp), user.signUp);

router.post('/guest', validate(userSchemas.guest), user.guest);

router.post('/refresh', verify, user.refresh);

router.patch('/:id/:role', verify, user.editRole);

export default router;