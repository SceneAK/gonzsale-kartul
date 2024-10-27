const router = require('express').Router();
const { verifyAuthToken_middle } = require('../modules/tokenAuth')
const { getProduct, getProducts, createProduct} = require('../controllers/product')

router.get('/', getProducts)

router.get('/:id', getProduct);

router.post('/create/', verifyAuthToken_middle, createProduct);

module.exports = router;