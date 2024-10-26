const router = require('express').Router();
const { checkAuthToken_middle } = require('../modules/auth')
const { getProduct, getProducts, createProduct} = require('../controllers/product')

// general
router.get('/', getProducts)

// single
router.get('/:id', getProduct);

// create 
router.post('/create/', checkAuthToken_middle, createProduct);

module.exports = router;