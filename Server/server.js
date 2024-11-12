const upath = require('upath');

// Create express app
const express = require('express'); 
const app = express()

// load .env file to process.env
require('dotenv').config();
const PORT = process.env.PORT;

// request logging
app.use((req, res, next) => {console.log(req.path, req.method); next();})

// parses req.json and puts it into req.body if it's a json type
app.use(
  (req, res, next) => {
    if(req.headers['content-type'] == 'application/json')
    {
      express.json({limit: '1mb'})(req, res, next);
    }else{
      next();
    }
  }
);

const PUBLIC_DIR = upath.join(__dirname, '/public/');
const SOURCE_ROUTE_NAME = 'source';
module.exports = {
  SOURCE_ROUTE_NAME,
  PUBLIC_DIR
};
app.use(`/${SOURCE_ROUTE_NAME}/`, express.static(PUBLIC_DIR));

// MOUNTS ROUTES
const productRoute = require('./routes/productRoute')
app.use('/', productRoute); 
const userRoute = require('./routes/userRoute')
app.use('/user/', userRoute);
const storeRoute = require('./routes/storeRoute')
app.use('/store/', storeRoute);

// error handling
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Error')
  })

// Start Listening
app.listen(PORT, () => {console.log(`listening on ${PORT}`)})