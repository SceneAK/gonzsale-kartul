import cls from 'cls-hooked';
import { Sequelize, DataTypes } from 'sequelize';
import { logger } from '../common/index.js';
import { env } from '../../initialize.js';

const gonzsaleNamespace = cls.createNamespace('gonzsaleNamespace');
Sequelize.useCLS(gonzsaleNamespace);

let sequelize = new Sequelize(env.MYSQL_URI);
logger.info('Database connection created');

function getInstance()
{
    return sequelize;
}
async function switchURI(uri)
{
    await sequelize.close();
    sequelize = new Sequelize(uri);
}

export { getInstance, switchURI, Sequelize, DataTypes, gonzsaleNamespace};