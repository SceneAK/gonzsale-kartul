import express from 'express';
const router = express.Router();

import { verifyAuthToken_middle } from '../modules/tokenAuth.js';
import { getProduct, getProducts, createProduct} from '../controllers/product.js'
import { images } from '../modules/upload.js';

router.get('/', getProducts)

router.get('/:id', getProduct);

router.post('/create/', verifyAuthToken_middle, images, createProduct);

export default router;