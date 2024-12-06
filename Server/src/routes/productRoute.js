import express from 'express';
const router = express.Router();

import { verifyUser } from '../modules/tokenAuth.js';
import { ensureBelowLimit, createMulter } from '../modules/upload.js';
import { validate, productSchemas } from '../reqSchemas/index.js';
import { product } from '../controllers';

router.get('/get/:product_category', validate(productSchemas.getProducts), product.getProducts);

router.get('/get/single/:id', product.getProduct);

const imgUpload = createMulter({relativeDir: 'images', keyName: 'images', isArray: true});

router.post('/create/', verifyUser, ensureBelowLimit, imgUpload, validate(productSchemas.createProduct), product.createProduct);

export default router;