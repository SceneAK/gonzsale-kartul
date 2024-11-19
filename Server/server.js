import app from './app.js';

// MOUNTS ROUTES
app.use('/', (await import('./src/routes/productRoute.js')).default);
app.use('/user/', (await import('./src/routes/userRoute.js')).default);
app.use('/store/', (await import('./src/routes/storeRoute.js')).default);
app.use('/order/', (await import('./src/routes/orderRoute.js')).default);

// Start Listening
const PORT = process.env.PORT;
app.listen(PORT, () => {console.log(`listening on ${PORT}`)})