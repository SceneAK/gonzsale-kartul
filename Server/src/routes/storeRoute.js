import { store }from '../controllers/index.js';
import { verify, validate, createUpload, ensureBelowLimit, ensureStore, ensureAdmin} from '../middlewares/index.js'
import { storeSchemas, page} from '../reqSchemas/index.js';
import express from 'express';

const storeImgUpload = createUpload('images/store/', { mimetype: 'image', type: 'single', keyName: 'image'});

const router = express.Router();

router.get('/all', validate(page), store.fetchStores);

router.get('/', verify(), ensureStore, store.fetchOwnedStore);

router.get('/:id', store.fetchStore);

router.get('/analytics', verify(), ensureStore, validate(storeSchemas.analytics), store.fetchMyStoreAnalytics);

router.get('/:storeId/analytics', verify(), ensureAdmin, validate(storeSchemas.analytics), store.fetchStoreAnalytics);

router.post('/', verify(), ensureBelowLimit, storeImgUpload, validate(storeSchemas.createStore), store.createStore);

router.patch('/', verify(), ensureStore, ensureBelowLimit, validate(storeSchemas.updateStore), store.updateStore);

router.patch('/image', verify(), ensureStore, ensureBelowLimit, storeImgUpload, validate(storeSchemas.updateStoreImage), store.updateStoreImage);

export default router;