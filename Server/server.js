import app from './app.js';
import cors from 'cors';
import { userRoute, productRoute, storeRoute, orderRoute, transactionRoute } from './src/routes/index.js';
import { logger } from './src/modules/logger.js';

app.use(cors(
    { 
        origin: 'http://localhost:3000',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
}));

// MOUNTS ROUTES
app.use('/api/product/', productRoute);
app.use('/api/user/', userRoute);
app.use('/api/store/', storeRoute);
app.use('/api/order/', orderRoute);
app.use('/api/transaction/', transactionRoute);

// Start Listening
const PORT = process.env.PORT;
app.listen(PORT, () => { logger.info(`listening on ${PORT}`)} )