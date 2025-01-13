import { STATIC_ROUTE_NAME, PUBLIC_DIR, __dirname } from './initialize.js';
import upath from 'upath';
import cookieParser from 'cookie-parser';
import express from 'express'; 
import { httpLogger } from './src/common/index.js';
import './signalHandlers.js';
import cors from 'cors';


const app = express()
app.use(cors(
  { 
      origin: 'http://localhost:3000',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
  })
);

// static routes
const pagesPath = upath.join(__dirname, '../Client');
app.use(`/`, express.static(pagesPath)); 
app.use(`/${STATIC_ROUTE_NAME}/`, express.static(PUBLIC_DIR)); 

// Middlewares
app.use(cookieParser(process.env.JWT_SECRET_KEY));
app.use(httpLogger)
app.use( (req, res, next) => {
    if(req.headers['content-type'] == 'application/json')
    {
      express.json({limit: '1mb'})(req, res, next);
    }else{
      next();
    }
  }
);

export default app;