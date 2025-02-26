import cleanUp from './cleanup.js';
import { logger } from './src/systems/index.js';

process.on('SIGTERM', handle);
process.on('SIGHUP', handle)
process.on('SIGINT', handle);
async function handle()
{
    await cleanUp();
    process.exit(0)
}

// Errors 
process.on('uncaughtException', async error => { 
    logError('Uncaught Exception', error); 
    await cleanUp();
    process.exit(1);
}); 
process.on('unhandledRejection', async (reason, promise) => { 
    logError('Unhandled Rejection', reason);
    await cleanUp();
    process.exit(1);
});
function logError(context, error)
{
    if(logger.level == 'debug')
    {
        console.error(error);
        logger.error(error, context); 
    }else{
        logger.error(`${context}: ` + error.message);
    }
}