import express from 'express';
import fs from 'fs';
import os from 'os';
const router = express.Router();

import { verify } from '../middlewares/index.js';
import userServices from '../services/userServices.js';
import ApplicationError from '../common/errors.js';

const mustBeAdmin = async (req, res, next) => {
    const role = await userServices.fetchUserRole(req.decodedAuthToken.id);
    if(role != userServices.ROLES['Admin']) throw new ApplicationError("No Access", 403);
    next();
}

router.get('/logs', verify(), mustBeAdmin, async (req, res) => {
    const logs = fs.readFileSync('./Server/.log', 'utf-8');
    const arr = logs.split(os.EOL);
    res.json(arr);
})


export default router;