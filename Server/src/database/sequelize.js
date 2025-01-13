import '../../initialize.js'; // ensure process.env is up
import cls from 'cls-hooked';
import { Sequelize, DataTypes } from 'sequelize';
import { logger } from '../common/index.js';

const namespace = cls.createNamespace('gonzsaleNamespace');
Sequelize.useCLS(namespace);

let sequelize = new Sequelize(process.env.URI);
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

export { getInstance, switchURI, Sequelize, DataTypes};