module.exports = (sequelize, DataTypes) => {
  const UsersFriends = sequelize.define('UsersFriends', {
    user_id: DataTypes.INTEGER,
    friend_id: DataTypes.INTEGER,
    accepted: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
  }, 
  {
    tableName: 'users_friends',
  });
  return UsersFriends;
};