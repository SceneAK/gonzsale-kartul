import { store }from '../controllers/index.js';
import { verifyUser } from '../modules/tokenAuth.js';
import { ensureBelowLimit, createMulter} from '../modules/upload.js'; 
import { validate, storeSchemas } from '../reqSchemas/index.js';
import express from 'express';
const router = express.Router();

router.get('/:id', store.getStore);

const imgUpload = createMulter({relativeDir: "images/store/", keyName: "store_imgSrc", isArray: false});

router.post('/', verifyUser, ensureBelowLimit, imgUpload, validate(storeSchemas.createStore), store.createStore);

router.patch('/', verifyUser, ensureBelowLimit, imgUpload, store.updateStore);

export default router;