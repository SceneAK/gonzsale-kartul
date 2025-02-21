import express from 'express';
const router = express.Router();

import { ensureBelowLimit, createMulter, verify, validate, ensureStore } from '../middlewares/index.js';
import { page, productImageSchemas, productSchemas, variantSchema } from '../reqSchemas/index.js';
import { product, variant, productImage } from '../controllers/index.js';

const productImgUploads = createMulter({relativeDir: 'images/products/', keyName: 'images', type: 'array', maxCount: 4});

router.get('/search', validate(productSchemas.fetchFiltered), product.fetchProducts);

router.get('/owned', verify(), ensureStore, validate(productSchemas.fetchFiltered), product.fetchOwnedProducts);

router.get('/:id', product.fetchProduct);

router.get('/variant/:id', product.fetchProductByVariant);

router.patch('/:id', verify(), ensureStore, validate(productSchemas.editProduct), product.editProduct);

router.post('/', verify(), ensureStore, validate(productSchemas.createProduct), product.createProduct);

router.delete('/:id', verify(), ensureStore, product.deleteProduct);

router.post('/:productId/images', verify(), ensureStore, ensureBelowLimit, productImgUploads, validate(productImageSchemas.createProductImages), productImage.createProductImage);

router.delete('/images/:id', verify(), ensureStore, productImage.deleteProductImage);

router.post('/:productId/variant', verify(), ensureStore, validate(variantSchema.createVariant), variant.createVariant);

export default router;