const express = require('express');
const router = express.Router();
const {staticRouteName, imagePath} = require('../controllers/upload');

// static
router.use(staticRouteName, express.static(imagePath));



module.exports = router;