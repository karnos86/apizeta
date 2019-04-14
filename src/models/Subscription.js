const Sequelize = require('sequelize');
const db = require('../../bin/database');
const Customer = require('./Customer');

    

  const Subcription= db.define('subcription', {
    reference:{
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: true,
      unique: 'compositeIndex'
    },
    method:{
      type: Sequelize.STRING,
      allowNull: true
    },
    subscription:{
      type: Sequelize.STRING,
      allowNull: true
    },
    start: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    end: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    paid:{
      type: Sequelize.BOOLEAN,
      allowNull: false, 
      defaultValue: false
    },
    status:{
      type: Sequelize.STRING,
      allowNull: true
    },
  });

  Customer.hasMany(Subcription, {foreignKey: 'idConekt'});
  Subcription.belongsTo(Customer,{foreignKey: 'idConekt'});

 
module.exports=Subcription;
