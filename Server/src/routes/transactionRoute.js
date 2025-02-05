import express from 'express';
import { verify, validate } from '../middlewares/index.js';
import { transaction } from '../controllers/index.js';
import { createMulter } from '../middlewares/index.js';
import { transactionSchemas } from '../reqSchemas/index.js';

const router = express.Router();
const transactionUpload = createMulter({relativeDir: 'Transactions', keyName: 'file', type: 'single'})

router.get('/:id', verify(), transaction.fetchTransaction);

router.post('/:orderId/cod', validate(transactionSchemas.createCOD), transaction.createCODTransaction);
router.post('/:orderId/proof', verify(false), transactionUpload, validate(transactionSchemas.createProof), transaction.createProofTransaction);

export default router;