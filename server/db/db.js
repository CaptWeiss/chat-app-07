const Sequelize = require("sequelize");

const password = process.env.DB_PASSKEY;
const dbName = process.env.DB_NAME;
const username = process.env.USERNAME;
const db = new Sequelize(dbName, username, password, {
  logging: false,
  host: process.env.HOST,
  dialect: 'postgres'
});

module.exports = db;
