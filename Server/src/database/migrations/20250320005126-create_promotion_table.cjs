'use strict';
const Sequelize = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up({context: queryInterface}) {
    await queryInterface.createTable('promotion', {
      id: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        primaryKey: true,
      },
      email: {
        type: Sequelize.STRING(320),
        allowNull: false,
        unique: true, 
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      name: {
        type: Sequelize.STRING(35),
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM('USER', 'STORE_MANAGER', 'ADMIN'),
        allowNull: false,
        defaultValue: 'USER',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      }
    }, { engine: 'InnoDB' });
  },

  async down({context: queryInterface}) {

  }
};