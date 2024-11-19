import { STATIC_ROUTE_NAME, PUBLIC_DIR } from './initialize.js';
import express from 'express'; 

const app = express()

// static route
app.use(`/${STATIC_ROUTE_NAME}/`, express.static(PUBLIC_DIR)); 

// logs
app.use((req, res, next) => {console.log(req.path, req.method); next();})

// Parse req.json if it's json
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

// error handling
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Error')
})

export default app;