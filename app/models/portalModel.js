module.exports = (sequelize, Sequelize) => {
    const Portal = sequelize.define("portals", {
      id: {
        type: Sequelize.INTEGER,
        unique: true,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.INTEGER,
      },
      portal_script: {
        type: Sequelize.STRING
      },
      portal_name: {
        type: Sequelize.STRING
      },
    });
    return Portal;
  };
  