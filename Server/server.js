const path = require('path');

// Create express app
const express = require('express'); 
const app = express()

// load .env file to process.env
require('dotenv').config();
const PORT = process.env.PORT;

// request logging
app.use((req, res, next) => {console.log(req.path, req.method); next();})

// parses req.json and puts it into req.body
app.use(express.json({limit: '1mb'}));


// MOUNTS ROUTES
const productRoute = require('./routes/productRoute')
app.use('/', productRoute); 
const userRoute = require('./routes/userRoute')
app.use('/user/', userRoute);
const storeRoute = require('./routes/storeRoute')
app.use('/store/', storeRoute);
const uploadRoute = require('./routes/uploadRoute')
app.use('/upload/', uploadRoute);

// error handling
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Error')
  })

// Start Listening
app.listen(PORT, () => {console.log(`listening on ${PORT}`)})

