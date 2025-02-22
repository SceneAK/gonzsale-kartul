import dbInitPromise from "./initialize.js";
const {sequelize} = await dbInitPromise;
const queryInterface = sequelize.getQueryInterface();

await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');
await queryInterface.dropAllTables();
await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');
await sequelize.sync({force: true});