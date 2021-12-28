module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "hatecrew2",
    DB: "individualproject",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };