import { variant } from '../controllers/index.js';
import { verify, validate, ensureStore } from '../middlewares/index.js';
import { variantSchema } from '../reqSchemas/index.js'
import express from 'express';
const router = express.Router();

router.patch('/:id/default', verify(), ensureStore, variant.setDefault);

router.patch('/:id/edit', verify(), ensureStore, validate(variantSchema.editVariant), variant.editVariant);

router.delete('/:id', verify(), ensureStore, variant.deleteVariant);

export default router;