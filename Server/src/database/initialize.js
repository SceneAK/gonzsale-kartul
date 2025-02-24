import db from './models/index.js';
import { logger } from '../common/index.js';

//import './wipe.js';

const dbInitPromise = (async () => {
  try
  {
    await db.sequelize.authenticate();
    logger.info('Database initialized');
    return db;
  }catch(err)
  {
    logger.error('Error initializing database: ' + err);
    throw err;
  }
})();

export default dbInitPromise;