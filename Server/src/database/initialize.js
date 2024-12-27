import '../../../initialize.js'; // ensure process.env is up
import { sequelize } from './sequelize.js';
import * as models from './models/index.js'; // ensure models are set up
import { logger } from '../logger.js';

const databaseInitializePromise = (async () => {
  try
  {
    await sequelize.authenticate();
    await sequelize.sync();
    logger.info('Database connnected and synced');
    return {sequelize, ...models};
  }catch(err)
  {
    logger.error('Error setting up database: ' + err);
    throw err;
  }
})();

export default databaseInitializePromise;