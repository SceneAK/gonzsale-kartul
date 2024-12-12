import { STATIC_ROUTE_NAME, PUBLIC_DIR } from './initialize.js';
import cookieParser from 'cookie-parser';
import express from 'express'; 
import { httpLogger, logger } from './src/modules/logger.js';
import cleanUp from './cleanup.js';


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

process.on('SIGTERM', async ()=>{
  await cleanUp();
  process.exit(1)
});
process.on('SIGINT', async ()=>{
  await cleanUp();
  process.exit(1)
});
process.on('uncaughtException',async error => { 
    logger.error('Uncaught Exception: ' + error); 
    await cleanUp();
    process.exit(1);
}); 
process.on('unhandledRejection', async (reason, promise) => { 
    logger.error('Unhandled Rejection: ' + reason);
    await cleanUp();
    process.exit(1);
});

// error handling
app.use((err, req, res, next) => {
  logger.error(err.stack)
  res.status(500).send('Error')
})

export default app;