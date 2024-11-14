import {getStore, createStore, updateStore}from '../controllers/store.js';
import { verifyAuthToken_mid } from '../modules/tokenAuth.js';
import {image} from '../modules/upload.js'; 
import express from 'express';
const router = express.Router();

router.get('/:id', getStore);

router.post('/create/', verifyAuthToken_mid, createStore);

router.patch('/edit/', verifyAuthToken_mid, image, updateStore);

export default router;