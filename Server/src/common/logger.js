import {PROJECT_DIR, SERVER_DIR, env } from '../../initialize.js';
import upath from 'upath';
import pinoHttp from 'pino-http';
import pino from "pino";

const dest = pino.destination(upath.join(PROJECT_DIR, './Client/log'))
const level = env.NODE_ENV.toLowerCase() == 'development' ? 'debug' : 'info';
const logger = pino({ 
    level,
    timestamp: pino.stdTimeFunctions.epochTime
}, dest);
const httpLogger = pinoHttp({logger})

export {logger, httpLogger};