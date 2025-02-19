import { getInstance, switchURI } from './src/database/sequelize.js';
import { logger } from './src/common/index.js';
import readline from 'readline';

let rl;
async function questionAsync(msg) {
    rl = readline.createInterface(process.stdin, process.stdout);
    rl.on('SIGINT', cleanup);
    return new Promise( resolve => {
        rl.question(msg, answer => {
            resolve(answer);
            rl.close();
        });
    });
}
function stringToBool(str) { return str.toLowerCase() === "true"; }

async function cleanup()
{
    const activeSequelizeInstance = getInstance();
    await activeSequelizeInstance.close();
    rl?.close();
    logger.info('Cleanup');
    logger.flush();
    process.exit();
}
process.on('SIGINT', cleanup)


async function sync()
{
    logger.info('Start Sync');
    //const privileged = await questionAsync('URI: ');
    const force =  stringToBool(await questionAsync('FORCE (will drop tables): '));
    //await switchURI(privileged)
    const sequelize = getInstance();
    try
    {
        await sequelize.authenticate();
    
        await import('./src/database/models/index.js')
        await sequelize.sync({force});
        logger.info(`Successfully ${force ? "Force" : ""} Synced`);
    }catch(err)
    {
        logger.error(err, "Error Syncing");
    }
    await cleanup();
}
sync();