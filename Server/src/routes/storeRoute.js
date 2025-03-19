import { store }from '../controllers/index.js';
import { populateAuthJwt, validate, createUpload, ensureBelowLimit, ensureIsStore, ensureAdminOr, ensureAdmin} from '../middlewares/index.js'
import { storeSchemas, page} from '../reqSchemas/index.js';
import express from 'express';

const storeImgUpload = createUpload('images/store/', { mimetype: 'image', type: 'single', keyName: 'image'});

const router = express.Router();

router.get('/all', validate(page), store.fetchStores);

router.get('/:id', store.fetchStore);

router.get('/:id/analytics', populateAuthJwt(), ensureAdminOr(ensureIsStore('id')), validate(storeSchemas.analytics), store.fetchStoreAnalytics);

router.post('/', populateAuthJwt(), ensureBelowLimit, storeImgUpload, validate(storeSchemas.createStore), store.createStore);

router.patch('/:id', populateAuthJwt(), ensureIsStore('id'), ensureBelowLimit, validate(storeSchemas.updateStore), store.updateStore);

router.patch('/:id/image', populateAuthJwt(), ensureIsStore('id'), ensureBelowLimit, storeImgUpload, validate(storeSchemas.updateStoreImage), store.updateStoreImage);

export default router;