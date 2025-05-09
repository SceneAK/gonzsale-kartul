import express from 'express';
import fs from 'fs';
import os from 'os';
const router = express.Router();

import { ensureAdmin, populateAuthJwt } from '../middlewares/index.js';
router.get('/logs', populateAuthJwt(), ensureAdmin, async (req, res) => {
    const logs = fs.readFileSync('./Server/.log', 'utf-8');
    const arr = logs.split(os.EOL);
    res.json(arr);
})


export default router;