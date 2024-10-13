const router = require('express').Router(); // creates router

router.get('/', (req, res)=> { res.json({mssg: "GET Request"})});


// when require(router1) is called elsewhere, the script will return this obj
module.exports = router;