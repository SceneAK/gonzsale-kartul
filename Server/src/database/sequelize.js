import '../../initialize.js'; // ensure process.env is up
import cls from 'cls-hooked';
import { Sequelize, DataTypes } from 'sequelize';

const namespace = cls.createNamespace('gonzsaleNamespace');
Sequelize.useCLS(namespace);

const sequelize = new Sequelize(process.env.MYSQL_URI);
export { sequelize, Sequelize, DataTypes};