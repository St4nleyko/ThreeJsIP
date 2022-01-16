// const bcrypt = require("bcrypt");

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    id: {
      type: Sequelize.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true

    },
    character_id: {
      type: Sequelize.INTEGER
    },
    username: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
      },
    password: {
        type: Sequelize.STRING
      }
    });
    return User;

};
