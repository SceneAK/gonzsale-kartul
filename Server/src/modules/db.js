import '../../initialize.js'; // ensure process.env is up
import mysql from 'mysql2/promise';
import { logger } from './logger.js';

let connectionPromise = mysql.createConnection(process.env.MYSQL_URI);

// SETUP CONNECTION
(async () => { 
  // Connect
  const connection = await connectionPromise;
  try {
    await connection.connect();
    logger.info('Connected as id ' + connection.threadId)
  } catch (err) {
    logger.error('Could not connect: ' + err);
  }
})(); // call

export default connectionPromise;
