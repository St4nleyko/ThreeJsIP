module.exports = (sequelize, Sequelize) => {
    const Portal = sequelize.define("portals", {
      id: {
        type: Sequelize.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.INTEGER,
      },
      portal_file: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING
      },
      portal_name: {
        type: Sequelize.STRING
      },
    });
    return Portal;
  };
  