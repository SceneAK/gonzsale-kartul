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
  
  // End if Interrupted 
  process.on('SIGINT',() => {
    try {
      connection.end().then( () => { logger.info('Connection closed'); process.exit(0)});
    } catch (err) {
      logger.error('Error closing connection:', err)
      process.exit(1);
    }
  });
})(); // call

export default connectionPromise;
