import { user } from '../controllers/index.js';
import { verify, validate } from '../middlewares/index.js';
import { userSchemas } from '../reqSchemas/index.js'
import express from 'express';
const router = express.Router();

router.get('/', verify(), user.fetchUsers);

//router.get('/:id', verify, user.fetchUser);

router.post('/signin', validate(userSchemas.signIn), user.signIn);

router.post('/signup', validate(userSchemas.signUp), user.signUp);

router.post('/refresh', verify(), user.refresh);

router.post('/expire', user.expireCookie);

router.patch('/edit', verify(), validate(userSchemas.editContacts), user.editContacts);

router.patch('/:id/:role', verify(), user.editRole);

export default router;