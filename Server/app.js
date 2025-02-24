import { AGREED_PUBLIC_ROUTE_NAME, PUBLIC_DIR, STATIC_CLIENT_DIR, VIEW_DIR, env } from './initialize.js';
import cookieParser from 'cookie-parser';
import express from 'express'; 
import { httpLogger } from './src/common/index.js';
import './signalHandlers.js';
import cors from 'cors';
import { ssrRoute } from './src/routes/index.js';

const app = express()
app.use(cors(
  { 
      origin: env.CORS_ORIGIN,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
  })
);

// source
app.use(`/${AGREED_PUBLIC_ROUTE_NAME}`, express.static(PUBLIC_DIR)); 

// static client routes
if(env.ENABLE_STATIC_CLIENT?.toLowerCase() === 'true') 
{
  app.use(`/`, express.static(STATIC_CLIENT_DIR)); 
}

app.set('view engine', 'ejs');
app.set('views', VIEW_DIR)
app.use('/ssr', ssrRoute)

// Middlewares
app.use(cookieParser(env.JWT_SECRET_KEY));
app.use(httpLogger)
app.use( (req, res, next) => {
    if(req.headers['content-type'] == 'application/json')
    {
      try
      {
        express.json({limit: '1mb'})(req, res, next);
      }catch(err){next(err)}
    }else{
      next();
    }
  }
);

export default app;