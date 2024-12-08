import app from './app.js';
import cors from 'cors';

app.use(cors(
    { 
        origin: 'http://127.0.0.1:5500',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true
}));

// MOUNTS ROUTES
app.use('/product/', (await import('./src/routes/productRoute.js')).default);
app.use('/user/', (await import('./src/routes/userRoute.js')).default);
app.use('/store/', (await import('./src/routes/storeRoute.js')).default);
app.use('/order/', (await import('./src/routes/orderRoute.js')).default);

// Start Listening
const PORT = process.env.PORT;
app.listen(PORT, () => {console.log(`listening on ${PORT}`)})