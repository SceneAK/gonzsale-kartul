import { user } from '../controllers/index.js';
import { verify, validate, verifyReCAPTCHA } from '../middlewares/index.js';
import { userSchemas } from '../reqSchemas/index.js'
import express from 'express';
const router = express.Router();

router.get('/', verify(), user.fetchUsers);

//router.get('/:id', verify, user.fetchUser);

router.post('/signin', validate(userSchemas.signIn), user.signIn);

router.post('/signup', verifyReCAPTCHA, validate(userSchemas.signUp), user.signUp);

router.post('/refresh', verify(), user.refresh);

router.post('/expire', user.expireCookie);

router.patch('/:id/:role', verify(), user.editRole);

router.patch('/', verify(), validate(userSchemas.editContacts), user.editContacts);

export default router;