import {__dirname } from '../../initialize.js';
import upath from 'upath';
import pinoHttp from 'pino-http';
import pino from "pino";

const dest = pino.destination(upath.join(__dirname, 'logs'))
const logger = pino({ 
    level: process.env.LOG_LEVEL || 'info',
    timestamp: pino.stdTimeFunctions.isoTime 
}, dest);
const httpLogger = pinoHttp({logger})

export {logger, httpLogger};