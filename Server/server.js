import 'express-async-errors';
import app from './app.js';
import { userRoute, productRoute, storeRoute, orderRoute, transactionRoute } from './src/routes/index.js';
import { onErrorFileDeletion } from './src/middlewares/multerUploads.js';
import { logger } from './src/common/index.js';
import errorHandler from './src/middlewares/errorHandler.js';

logger.info('Start Server');

// MOUNTS ROUTES
app.use('/api/product/', productRoute);
app.use('/api/user/', userRoute);
app.use('/api/store/', storeRoute);
app.use('/api/order/', orderRoute);
app.use('/api/transaction/', transactionRoute);

// Handled Errors
app.use(onErrorFileDeletion); // for multer
app.use(errorHandler)

// Start Listening
const PORT = process.env.PORT;
app.listen(PORT, () => { logger.info(`listening on ${PORT}`)} )