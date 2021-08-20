const Sequelize = require("sequelize");

const password = process.env.DB_PASSKEY || 'Collins25';
const dbName = process.env.DB_NAME || 'messenger';
const username = process.env.USERNAME;
const db = new Sequelize(dbName, username, password, {
  logging: false,
  host: process.env.HOST,
  dialect: 'postgres'
});

module.exports = db;
