import express from 'express';
const router = express.Router();

import { verifyAuthToken_mid } from '../modules/tokenAuth.js';
import { getProduct, getProducts, createProduct } from '../controllers/product.js';
import { ensureBelowLimit, createMulter, updateUsed } from '../modules/upload.js';

router.get('/get/filtered/:product_category', getProducts);

router.get('/get/:id', getProduct);

const imgUpload = createMulter({relativeDir: 'images', keyName: 'images', isArray: true});
router.post('/create/', verifyAuthToken_mid, ensureBelowLimit, imgUpload, updateUsed, createProduct);

export default router;