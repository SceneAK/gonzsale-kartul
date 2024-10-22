// Create express app
const express = require('express'); 
const app = express()

// load .env file to process.env
require('dotenv').config();
const PORT = process.env.PORT;

// request logging
app.use((req, res, next) => {console.log(req.path, req.method); next();})

// parses req.json and puts it into req.body
app.use(express.json());


// MOUNTS ROUTES
const defaultRoute = require('./routes/productRoute')
app.use('/', defaultRoute); 

// error handling
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Error')
  })

// Start Listening
app.listen(PORT, () => {console.log(`listening on ${PORT}`)})

