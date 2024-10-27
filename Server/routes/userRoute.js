const router = require('express').Router();
const { signIn, signUp} = require('../controllers/user')

// general
router.post('/signIn/', signIn);

// single
router.post('/signUp/', signUp);

module.exports = router;