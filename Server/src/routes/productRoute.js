const router = require('express').Router();

const { verifyAuthToken_middle } = require('../modules/tokenAuth')
const { getProduct, getProducts, createProduct} = require('../controllers/product')
const { images } = require('../modules/upload');

router.get('/', getProducts)

router.get('/:id', getProduct);

router.post('/create/', verifyAuthToken_middle, images, createProduct);

module.exports = router;