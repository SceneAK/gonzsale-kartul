import {getStore, createStore, updateStore}from '../controllers/store.js';
import { verifyAuthToken_mid } from '../modules/tokenAuth.js';
import { ensureBelowLimit, createMulter} from '../modules/upload.js'; 
import express from 'express';
const router = express.Router();

router.get('/get/:id', getStore);

router.post('/create/', verifyAuthToken_mid, createStore);

const imgUpload = createMulter({relativeDir: "images/store/", keyName: "store_imgSrc", isArray: false});
router.patch('/edit/', verifyAuthToken_mid, ensureBelowLimit, imgUpload, updateStore);

export default router;