'use strict';
const Sequelize = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up({context: queryInterface}) {
    await queryInterface.changeColumn('stores', 'image_id', {
      type: Sequelize.CHAR(36, true),
      allowNull: true,
    });
  },

  async down({context: queryInterface}) {
    await queryInterface.changeColumn('stores', 'image_id', {
      type: Sequelize.CHAR(36, true),
      allowNull: false,
    });
  }
};