import { store }from '../controllers/index.js';
import { verify, validate, createMulter, ensureBelowLimit, ensureStore} from '../middlewares/index.js'
import { storeSchemas } from '../reqSchemas/index.js';
import express from 'express';

const storeImgUpload = createMulter({
    relativeDir: "images/store/", 
    type: 'fields', 
    fields: [
        { name: 'imageFile', maxCount: 1 },
        { name: 'qrImageFile', maxCount: 1 }
    ]
});

const router = express.Router();

// router.get('/', verify(), ensureStore, store.fetchOwnedStore);

// router.get('/ban/question', (req, res) => { res.send("g")});

// router.get('/:id', store.fetchStore);

// router.post('/', verify(), ensureBelowLimit, storeImgUpload, validate(storeSchemas.createStore), store.createStore);

// router.patch('/', verify(), ensureStore, ensureBelowLimit, storeImgUpload, validate(storeSchemas.updateStore), store.updateStore);

export default router;