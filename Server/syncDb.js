import { getInstance, switchURI } from './src/database/sequelize.js';
import { logger } from './src/common/index.js';
import readline from 'readline';

const rl = readline.createInterface(process.stdin, process.stdout)
async function questionAsync(msg) {
    return new Promise( resolve => {
        rl.question(msg, answer => {
            resolve(answer);
            rl.close();
        });
    });
}

async function cleanup()
{
    const activeSequelizeInstance = getInstance();
    await activeSequelizeInstance.close();
    rl.close();
    logger.info('Cleanup');
    logger.flush();
    process.exit();
}
rl.on('SIGINT', cleanup);
process.on('SIGINT', cleanup)


async function sync()
{
    logger.info('Start Sync');
    const privileged = await questionAsync('URI: ');
    await switchURI(privileged)
    const sequelize = getInstance();
    try
    {
        await sequelize.authenticate();
    
        await import('./src/database/models/index.js')
        await sequelize.sync();
        logger.info('Successfully Synced');
    }catch(err)
    {
        logger.error(err, "Error Syncing");
    }
    await cleanup();
}
sync();