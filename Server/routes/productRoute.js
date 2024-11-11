const router = require('express').Router();

const { verifyAuthToken_middle } = require('../modules/tokenAuth')
const { getProduct, getProducts, createProduct} = require('../controllers/product')
const { imagesRouter } = require('../modules/upload');

router.get('/', getProducts)

router.get('/:id', getProduct);

router.post('/create/', verifyAuthToken_middle, imagesRouter, createProduct);

module.exports = router;