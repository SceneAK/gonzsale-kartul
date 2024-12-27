import express from 'express';
const router = express.Router();

import { ensureBelowLimit, createMulter, verify } from '../middlewares/index.js';
import { validate, productSchemas } from '../reqSchemas/index.js';
import { product } from '../controllers/index.js';

const imgUpload = createMulter({relativeDir: 'images', keyName: 'images', type: 'array'});

router.get('/:product_category', validate(productSchemas.getProducts), product.fetchProducts);

router.get('/single/:id', product.fetchProduct);

router.patch('/:id', verify, ensureBelowLimit, imgUpload, validate(productSchemas.editProduct), product.editProduct);

router.post('/', verify, ensureBelowLimit, imgUpload, validate(productSchemas.createProduct), product.createProduct);

export default router;