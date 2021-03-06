const config = require("../config/dbconfig.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,
    omitNull: true,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./userModel.js")(sequelize, Sequelize);
db.role = require("./roleModel.js")(sequelize, Sequelize);
db.portal = require("./portalModel.js")(sequelize, Sequelize);
db.friends = require("./friendModel.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId",
  as:"roles"
});
//friendlist
db.user.belongsToMany(db.user, { 
  as: 'friends',
  foreignKey: 'user_id',
  through: db.friends
});
db.user.belongsToMany(db.user, { 
  as: 'userFriends',
  foreignKey: 'friend_id',
  through: db.friends
});


db.ROLES = ["user", "admin", "creator"];

module.exports = db;