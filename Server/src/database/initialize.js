import db from './models/index.js';
import { logger } from '../systems/index.js';
import { migrateUp } from './migrator.js';
import { env } from '../../initialize.js';

const dbInitPromise = (async () => {
  try
  {
    await db.sequelize.authenticate();
    if(env.RUN_MIGRATION == "true")
    {
      await migrateUp(db.sequelize);
    }
    logger.info('Database initialized');
    return db;
  }catch(err)
  {
    logger.error('Error initializing database: ' + err);
    throw err;
  }
})();

export default dbInitPromise;