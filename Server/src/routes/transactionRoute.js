import express from 'express';
import { populateAuthJwt, validate } from '../middlewares/index.js';
import { transaction } from '../controllers/index.js';
import { createUpload } from '../middlewares/index.js';
import { transactionSchemas } from '../reqSchemas/index.js';

const router = express.Router();
const transactionUpload = createUpload('transactions', {keyName: 'image', type: 'single'})

router.get('/:id', populateAuthJwt(), transaction.fetchTransaction);

router.post('/:orderId/cod', validate(transactionSchemas.createCOD), transaction.createCODTransaction);
        
router.post('/:orderId/proof', populateAuthJwt({required: false}), transactionUpload, validate(transactionSchemas.createProof), transaction.createProofTransaction);

export default router;