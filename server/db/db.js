const Sequelize = require("sequelize");
const password = process.env.DB_PASSKEY;
console.log('passkey: ',{password});
const db = new Sequelize('messenger', 'captweiss', password, {
  logging: false,
  host: 'localhost',
  dialect: 'postgres'
});

module.exports = db;
