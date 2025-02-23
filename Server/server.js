import 'express-async-errors';
import app from './app.js';
import { userRoute, productRoute, storeRoute, orderRoute, transactionRoute, variantRoute, adminRoute } from './src/routes/index.js';
import { onErrorFileDeletion } from './src/middlewares/multerUploads.js';
import { logger } from './src/common/index.js';
import { env } from './initialize.js';
import errorHandler from './src/middlewares/errorHandler.js';
import https from 'https'
import http from 'http'
import fs from 'fs';


logger.info('Start Server');

// MOUNTS ROUTES
app.use('/api/product/', productRoute);
app.use('/api/user/', userRoute);
app.use('/api/store/', storeRoute);
app.use('/api/order/', orderRoute);
app.use('/api/transaction/', transactionRoute);
app.use('/api/variant/', variantRoute);
app.use('/api/admin/', adminRoute)

// Handled Errors
app.use(onErrorFileDeletion); // for multer
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