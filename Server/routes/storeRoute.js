const router = require('express').Router();
const {getStore, createStore} = require('../controllers/store');

router.get('/:id', getStore);

router.post('/create/', createStore);

module.exports = router;