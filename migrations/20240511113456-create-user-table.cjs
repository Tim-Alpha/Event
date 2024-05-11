'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true
      },
      username: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      role: {
        type: Sequelize.ENUM("ADMIN", "USER", "OWNER"),
        allowNull: false,
        defaultValue: "USER",
      },
      firstName: {
        type: Sequelize.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      lastName: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      isEmailVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      isMobileVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      address: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      profileUrl: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      dob: {
        type: Sequelize.DATE,
        allowNull: true
      },
      mobile: {
        type: Sequelize.STRING(10),
        allowNull: false,
        unique: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};
