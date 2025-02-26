import initPromise from './src/database/initialize.js';
const { sequelize } = await initPromise;

import { logger } from "./src/systems/index.js";

export default async function cleanUp()
{
    logger.info("Cleaning Up");
    try
    {
        await sequelize.close();
        logger.info('Connection closed');
    }catch(err){
        logger.error('Error closing connection: ' + err)
    }
    logger.flush();
}
