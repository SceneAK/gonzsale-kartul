import { getInstance } from './sequelize.js';
import * as models from './models/index.js';
import { logger } from '../common/index.js';

const databaseInitializePromise = (async () => {
  try
  {
    const sequelize = getInstance();
    await sequelize.authenticate();
    logger.info('Database initialized');
    return { sequelize, ...models };
  }catch(err)
  {
    logger.error('Error initializing database: ' + err);
    throw err;
  }
})();

export default databaseInitializePromise;