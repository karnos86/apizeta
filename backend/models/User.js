const Sequelize = require('sequelize');
const db = require('../../bin/database');
    

const User= db.define('user', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        username:{
          type: Sequelize.STRING,
          allowNull: true
        },
        password: {
          type: Sequelize.STRING,
          allowNull: true
        },
        type:{
          type: Sequelize.STRING,
          allowNull: true
        }
});

  module.exports=User;
