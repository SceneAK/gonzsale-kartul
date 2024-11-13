import express from 'express'; 
import dotenv from 'dotenv';
import { STATIC_ROUTE_NAME, PUBLIC_DIR } from './src/modules/directoryData.js';

// Create express app
const app = express()

// load .env file to process.env
dotenv.config();
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


app.use(`/${STATIC_ROUTE_NAME}/`, express.static(PUBLIC_DIR));

// MOUNTS ROUTES
app.use('/', (await import('./src/routes/productRoute.js')).default);
app.use('/user/', (await import('./src/routes/userRoute.js')).default);
app.use('/store/', (await import('./src/routes/storeRoute.js')).default);

// error handling
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Error')
  })

// Start Listening
app.listen(PORT, () => {console.log(`listening on ${PORT}`)})