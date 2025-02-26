import express from 'express';
const router = express.Router();

import { ensureBelowLimit, createUpload, verify, validate, ensureStore } from '../middlewares/index.js';
import { productImageSchemas, productSchemas, variantSchema } from '../reqSchemas/index.js';
import { product, variant, productImage } from '../controllers/index.js';


const productImgUploads = createUpload('images/products/', {keyName: 'images', type: 'array', maxCount: 4});

router.get('/search', validate(productSchemas.fetchFiltered), product.fetchProducts);

router.get('/owned', verify(), ensureStore, validate(productSchemas.fetchFiltered), product.fetchOwnedProducts);

router.get('/:id', product.fetchProduct);

router.get('/variant/:id', product.fetchProductByVariant);

router.patch('/:id', verify(), ensureStore, validate(productSchemas.editProduct), product.editProduct);

router.post('/', verify(), ensureStore, validate(productSchemas.createProduct), product.createProduct);

router.delete('/:id', verify(), ensureStore, product.deleteProduct);

router.post('/:productId/images', verify(), ensureStore, ensureBelowLimit, productImgUploads, validate(productImageSchemas.createProductImages), productImage.createProductImage);

router.delete('/image/:id', verify(), ensureStore, productImage.deleteProductImage);

router.post('/:productId/variants', verify(), ensureStore, validate(variantSchema.createVariants), variant.createVariants);

export default router;