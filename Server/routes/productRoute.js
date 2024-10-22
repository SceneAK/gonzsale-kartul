const router = require('express').Router();
const { getProduct, getProducts} = require('../controllers/product')

// general
router.get('', getProduct)

// single
router.get('/:id', getProducts);

module.exports = router;