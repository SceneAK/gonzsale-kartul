import express from 'express';
import { userRoute, productRoute, storeRoute, orderRoute, transactionRoute, variantRoute, adminRoute } from './index.js';

const route = express.Router()

route.use('/product/', productRoute);
route.use('/user/', userRoute);
route.use('/store/', storeRoute);
route.use('/order/', orderRoute);
route.use('/transaction/', transactionRoute);
route.use('/variant/', variantRoute);

export default route;