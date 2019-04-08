
const Sequelize = require('sequelize');
module.exports = new Sequelize(process.env.NAME_DB, process.env.USER_DB, process.env.PASSWORD_DB, {
  host: process.env.HOST_DATABASE,
  dialect: process.env.DIALECT_DB,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})
