import { STATIC_ROUTE_NAME, PUBLIC_DIR } from './initialize.js';
import cookieParser from 'cookie-parser';
import express from 'express'; 
import { httpLogger, logger } from './src/modules/logger.js';


const app = express()

// static routes
app.use(`/${STATIC_ROUTE_NAME}/`, express.static(PUBLIC_DIR)); 

app.use(cookieParser(process.env.JWT_SECRET_KEY));

// logs
app.use(httpLogger)

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
process.on('uncaughtException', (error) => { 
    logger.error('Uncaught Exception:', error); 
    process.exit(1);
}); 
process.on('unhandledRejection', (reason, promise) => { 
    logger.error('Unhandled Rejection:', reason);
});

// error handling
app.use((err, req, res, next) => {
  loggererror(err.stack)
  res.status(500).send('Error')
})

export default app;