import { variant } from '../controllers/index.js';
import { populateAuthJwt, validate, ensureIsStore } from '../middlewares/index.js';
import { variantSchema } from '../reqSchemas/index.js'
import express from 'express';
const router = express.Router();

router.patch('/:id/default', populateAuthJwt(), ensureIsStore(), variant.setDefault);

router.patch('/:id/edit', populateAuthJwt(), ensureIsStore(), validate(variantSchema.editVariant), variant.editVariant);

router.delete('/:id', populateAuthJwt(), ensureIsStore(), variant.deleteVariant);

export default router;