import {getStore, createStore}from '../controllers/store.js';
import express from 'express';
const router = express.Router();

router.get('/:id', getStore);

router.post('/create/', createStore);

export default router;