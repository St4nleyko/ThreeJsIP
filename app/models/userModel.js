// const bcrypt = require("bcrypt");

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    id: {
      type: Sequelize.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true

    },
    profile_picture: {
      type: Sequelize.STRING
    },
    username: {
      type: Sequelize.STRING,
      unique: true
    },
    password: {
      type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING,
        unique: true
      },
    password: {
        type: Sequelize.STRING
      }
    });
    return User;

};
