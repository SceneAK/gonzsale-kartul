import { store }from '../controllers/index.js';
import { verify, validate, createUpload, ensureBelowLimit, ensureStore} from '../middlewares/index.js'
import { storeSchemas } from '../reqSchemas/index.js';
import express from 'express';

const storeImgUpload = createUpload('images/store/', { mimetype: 'image', type: 'single', keyName: 'image'});

const router = express.Router();

router.get('/', verify(), ensureStore, store.fetchOwnedStore);

router.get('/:id', store.fetchStore);

router.post('/', verify(), ensureBelowLimit, storeImgUpload, validate(storeSchemas.createStore), store.createStore);

router.patch('/', verify(), ensureStore, ensureBelowLimit, validate(storeSchemas.updateStore), store.updateStore);

router.patch('/image', verify(), ensureStore, ensureBelowLimit, storeImgUpload, validate(storeSchemas.updateStoreImage), store.updateStoreImage);

export default router;