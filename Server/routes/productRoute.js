const router = require('express').Router();
const { checkAuthToken_middle } = require('../modules/auth')
const { getProduct, getProducts, createProduct} = require('../controllers/product')

// general
router.get('', getProduct)

// single
router.get('/:id', getProducts);

// create 
router.post('/', checkAuthToken_middle, createProduct);

module.exports = router;