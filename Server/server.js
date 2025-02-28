import 'express-async-errors';
import app from './app.js';
import apiRoute from './src/routes/apiRoute.js'
import { adminRoute } from './src/routes/index.js';
import { logger } from './src/systems/logger.js';
import { env } from './initialize.js';
import errorHandler from './src/middlewares/errorHandler.js';
import https from 'https'
import http from 'http'
import fs from 'fs';
import rateLimit from 'express-rate-limit';

const globalLimitter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: env.RATE_LIMIT_MAX || 500,
    message: 'Too many requests, please wait.'
})
const apiLimitter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: env.API_RATE_LIMIT_MAX || 120,
    message: 'Too many requests, please wait.'
})
  

logger.info('Start Server');

app.use(globalLimitter);
app.set('trust proxy', env.TRUST_PROXY || 0);

app.use('/api', apiLimitter, apiRoute)
app.use('/admin', adminRoute)

// Handled Errors
app.use(errorHandler)

const logListening = (port)=> ()=>{
    logger.info(`listening on port ${port}`)
};

const protocol = env.PROTOCOL?.toLowerCase();
let server;
switch (protocol) {
    case 'https':
        let keyPath = env.SSL_KEY_PATH;
        let certPath = env.SSL_CERT_PATH;
        let combinedPath = env.SSL_COMBINED_PATH;
        if(combinedPath) {
            keyPath = combinedPath;
            certPath = combinedPath;
        }
        
        const httpsOptions = {
            key: fs.readFileSync(keyPath),
            cert: fs.readFileSync(certPath),
            //ca: env.SSL_CA_PATH != 'null' ? fs.readFileSync(env.SSL_CA_PATH) : undefined
        };
        server = https.createServer(httpsOptions, app);
        break;
    case 'http':
        server = http.createServer(app);
        break;
    default:
        server = app;
        break;
}

server.listen(env.PORT, logListening(env.PORT));