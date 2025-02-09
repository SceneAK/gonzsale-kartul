import express from 'express';
const router = express.Router();

import { ensureBelowLimit, createMulter, verify, validate } from '../middlewares/index.js';
import { page, productSchemas } from '../reqSchemas/index.js';
import { product } from '../controllers/index.js';

const imgUpload = createMulter({relativeDir: 'images', keyName: 'images', type: 'array', maxCount: 4});

router.get('/search', validate(productSchemas.fetchProducts), product.fetchProducts);

router.get('/owned', verify(), validate(page), product.fetchOwnedProducts);

router.get('/:id', product.fetchProduct);

router.patch('/:id', verify(), ensureBelowLimit, imgUpload, validate(productSchemas.editProduct), product.editProduct);

router.post('/', verify(), ensureBelowLimit, imgUpload, validate(productSchemas.createProduct), product.createProduct);

export default router;