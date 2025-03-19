import { user } from '../controllers/index.js';
import { populateAuthJwt, validate, verifyReCAPTCHA, ensureIsUser } from '../middlewares/index.js';
import { userSchemas } from '../reqSchemas/index.js'
import express from 'express';
const router = express.Router();

router.get('/', populateAuthJwt(), user.fetchUsers);

router.post('/signin', validate(userSchemas.signIn), user.signIn);

router.post('/signup', verifyReCAPTCHA, validate(userSchemas.signUp), user.signUp);

router.post('/refresh', populateAuthJwt(), user.refresh);

router.post('/expire', user.expireCookie);

router.patch('/:id/:role', populateAuthJwt(), user.editRole);

router.patch('/:id', populateAuthJwt(), ensureIsUser('id'), validate(userSchemas.editContacts), user.editContacts);

export default router;