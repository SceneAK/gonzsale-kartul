import cls from 'cls-hooked';
import { Sequelize, DataTypes } from 'sequelize';
import { logger } from '../common/index.js';
import { env } from '../../initialize.js';

const gonzsaleNamespace = cls.createNamespace('gonzsaleNamespace');
Sequelize.useCLS(gonzsaleNamespace);

let sequelize = new Sequelize({
    dialect: 'mysql',
    host: env.MYSQL_HOST,
    username: env.MYSQL_USERNAME,
    password: env.MYSQL_PASSWORD,
    port: env.MYSQL_PORT,
    database: env.MYSQL_DATABASE_NAME
});
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