import { store }from '../controllers';
import { verifyUser } from '../modules/tokenAuth.js';
import { ensureBelowLimit, createMulter} from '../modules/upload.js'; 
import { validate, storeSchemas } from '../reqSchemas';
import express from 'express';
const router = express.Router();

router.get('/get/:id', getStore);

const imgUpload = createMulter({relativeDir: "images/store/", keyName: "store_imgSrc", isArray: false});

router.post('/create/', verifyUser, ensureBelowLimit, imgUpload, validate(storeSchemas.createStore), store.createStore);

router.patch('/edit/', verifyUser, ensureBelowLimit, imgUpload, store.updateStore);

export default router;