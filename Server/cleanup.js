import connectionPromise from "./src/modules/db.js";
const connection = await connectionPromise;

import { logger } from "./src/modules/logger.js";

export default async function cleanUp()
{
    logger.info("Cleaning Up");
    try
    {
        await connection.end();
        logger.info('Connection closed');
    }catch(err){
        logger.error('Error closing connection: ' + err)
    }
    logger.flush();
}
