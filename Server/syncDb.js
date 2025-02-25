import dbPromise from './src/database/initialize.js'
import { logger } from './src/common/index.js';
import readline from 'readline';
const {sequelize} = await dbPromise;

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
    await sequelize.close();
    rl?.close();
    logger.info('Cleanup');
    logger.flush();
    process.exit();
}
process.on('SIGINT', cleanup)


async function sync()
{
    logger.info('Start Sync');
    const force =  stringToBool(await questionAsync('FORCE (will drop tables): '));
    try
    {
        await sequelize.authenticate();
        await sequelize.sync({force});
        logger.info(`Successfully ${force ? "Force" : ""} Synced`);
    }catch(err)
    {
        logger.error(err, "Error Syncing");
    }
    await cleanup();
}
sync();