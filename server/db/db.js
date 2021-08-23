const Sequelize = require("sequelize");

const db = new Sequelize(process.env.DB_NAME, process.env.USERNAME, process.env.DB_PASSKEY, {
  logging: false,
  host: process.env.HOST,
  dialect: 'postgres'
});

module.exports = db;
