import { readdir } from 'fs/promises';
import path from 'path';
import {pathToFileURL} from 'url';
import { fileURLToPath } from 'url';
import { Sequelize, DataTypes } from 'sequelize';
import config from '../config/config.js';
import { logger } from '../../systems/logger.js';
import cls from 'cls-hooked';
import { env } from '../../../initialize.js';

//#region Sequelize
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const gonzsaleNamespace = cls.createNamespace('gonzsaleNamespace');
Sequelize.useCLS(gonzsaleNamespace);

const node_env = env.NODE_ENV || 'development';
const db = {};
const sequelize = new Sequelize(
    config[node_env].database,
    config[node_env].username,
    config[node_env].password,
    {...config[node_env], define: {
        underscored: true
    }}
);
logger.info('Database connection created');
//#endregion

//#region Export
const files = await readdir(__dirname);
for (const file of files) {
    if (file.endsWith('.js') && file !== 'index.js') {
        const modelPath = pathToFileURL(path.join(__dirname, file));
        
        const { default: initModel } = await import(modelPath);
        
        const model = initModel(sequelize, DataTypes);
        db[model.name] = model;
    }
}

for (const modelName in db) {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
//#endregion
