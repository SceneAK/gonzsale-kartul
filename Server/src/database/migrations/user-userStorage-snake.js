export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable('Users', 'users');
    await queryInterface.renameTable('UserStorages', 'user_storages');

    // Rename columns in 'users' table
    await queryInterface.renameColumn('users', 'createdAt', 'created_at');
    await queryInterface.renameColumn('users', 'updatedAt', 'updated_at');
    await queryInterface.renameColumn('users', 'deletedAt', 'deleted_at');

    // Rename columns in 'user_storages' table
    await queryInterface.renameColumn('user_storages', 'userId', 'user_id');
    await queryInterface.renameColumn('user_storages', 'createdAt', 'created_at');
    await queryInterface.renameColumn('user_storages', 'updatedAt', 'updated_at');
    await queryInterface.renameColumn('user_storages', 'deletedAt', 'deleted_at');
  },

  down: async (queryInterface, Sequelize) => {
    // Revert column names in 'user_storages' table
    await queryInterface.renameColumn('user_storages', 'deleted_at', 'deletedAt');
    await queryInterface.renameColumn('user_storages', 'updated_at', 'updatedAt');
    await queryInterface.renameColumn('user_storages', 'created_at', 'createdAt');
    await queryInterface.renameColumn('user_storages', 'user_id', 'userId');

    // Revert column names in 'users' table
    await queryInterface.renameColumn('users', 'deleted_at', 'deletedAt');
    await queryInterface.renameColumn('users', 'updated_at', 'updatedAt');
    await queryInterface.renameColumn('users', 'created_at', 'createdAt');

    // Revert table names to original
    await queryInterface.renameTable('user_storages', 'UserStorages');
    await queryInterface.renameTable('users', 'Users');
  }
};
