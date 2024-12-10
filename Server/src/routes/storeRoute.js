import { store }from '../controllers/index.js';
import { verifyUser } from '../modules/tokenAuth.js';
import { ensureBelowLimit, createMulter} from '../modules/upload.js'; 
import { validate, storeSchemas } from '../reqSchemas/index.js';
import express from 'express';
const router = express.Router();

router.get('/:id', store.getStore);

const imgUpload = createMulter({relativeDir: "images/store/", type: 'fields', fields: [
    {name: 'store_imgSrc', maxCount: 1},
    {name: 'store_QR_imgSrc', maxCount: 1}
]});

router.post('/', verifyUser, ensureBelowLimit, imgUpload, validate(storeSchemas.createStore), store.createStore);

router.patch('/', verifyUser, ensureBelowLimit, imgUpload, validate(storeSchemas.updateStore), store.updateStore);

export default router;