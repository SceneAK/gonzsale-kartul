import databaseInitPromise from "./src/modules/database/initialize.js";
const { sequelize }= await databaseInitPromise;

import { logger } from "./src/modules/logger.js";

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
