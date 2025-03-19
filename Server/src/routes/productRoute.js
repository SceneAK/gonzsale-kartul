import express from 'express';
const router = express.Router();

import { ensureBelowLimit, createUpload, populateAuthJwt, validate, ensureIsStore, ensureAdminOr } from '../middlewares/index.js';
import { productImageSchemas, productSchemas, variantSchema } from '../reqSchemas/index.js';
import { product, variant, productImage } from '../controllers/index.js';


const productImgUploads = createUpload('images/products/', {keyName: 'images', type: 'array', maxCount: 4});

router.get('/search', validate(productSchemas.fetchFiltered), product.fetchProducts);

router.get('/store/:storeId', populateAuthJwt(), ensureAdminOr(ensureIsStore('storeId')), validate(productSchemas.fetchFiltered), product.fetchProductsOfStore);

router.get('/:id', product.fetchProduct);

router.get('/variant/:variantId', product.fetchProductByVariant);

router.patch('/:id', populateAuthJwt(), ensureIsStore(), validate(productSchemas.editProduct), product.editProduct);

router.post('/', populateAuthJwt(), ensureIsStore(), validate(productSchemas.createProduct), product.createProduct);

router.delete('/:id', populateAuthJwt(), ensureIsStore(), product.deleteProduct);

router.post('/:productId/images', populateAuthJwt(), ensureIsStore(), ensureBelowLimit, productImgUploads, validate(productImageSchemas.createProductImages), productImage.createProductImage);

router.delete('/image/:id', populateAuthJwt(), ensureIsStore(), productImage.deleteProductImage);

router.post('/:productId/variants', populateAuthJwt(), ensureIsStore(), validate(variantSchema.createVariants), variant.createVariants);

export default router;