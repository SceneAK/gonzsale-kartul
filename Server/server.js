import app from './app.js';
import cors from 'cors';
import {userRoute, productRoute, storeRoute, orderRoute, transactionRoute} from './src/routes/index.js';

app.use(cors(
    { 
        origin: 'http://127.0.0.1:5500',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true
}));

// MOUNTS ROUTES
app.use('/product/', productRoute);
app.use('/user/', userRoute);
app.use('/store/', storeRoute);
app.use('/order/', orderRoute);
app.use('/transaction/', transactionRoute);

// Start Listening
const PORT = process.env.PORT;
app.listen(PORT, () => {console.log(`listening on ${PORT}`)})