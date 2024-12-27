import { store }from '../controllers/index.js';
import { verify, createMulter, ensureBelowLimit} from '../middlewares/index.js'
import { validate, storeSchemas } from '../reqSchemas/index.js';
import express from 'express';
const router = express.Router();

router.get('/:id', store.fetchStore);

router.get('/', verify, store.fetchOwnedStore);

const storeImgUpload = createMulter({relativeDir: "images/store/", type: 'fields', fields: [
    {name: 'imageFile', maxCount: 1},
    {name: 'qrImageFile', maxCount: 1}
]});

router.post('/', verify, ensureBelowLimit, storeImgUpload, validate(storeSchemas.createStore), store.createStore);

router.patch('/', verify, ensureBelowLimit, storeImgUpload, validate(storeSchemas.updateStore), store.updateStore);

export default router;