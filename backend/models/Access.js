const Sequelize = require('sequelize');
const db = require('../../bin/database');
const Customer = require('./Customer');


  const Access= db.define('access', {
    uuii:{
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: true,
        unique: 'compositeIndex'
    },
    authorized:{
        type: Sequelize.BOOLEAN,
        allowNull: false, 
        defaultValue: false
    }

  })
  Customer.hasMany(Access, {foreignKey: 'idWordPress'});
  Access.belongsTo(Customer,{foreignKey: 'idWordPress'});
  
  module.exports = Access;
