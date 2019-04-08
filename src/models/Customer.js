const Sequelize = require('sequelize');
const db = require('../../bin/database');

    

  const Customer= db.define('customer', {
    idConekt:{
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: true,
      unique: 'compositeIndex'
    },
    username:{
      type: Sequelize.STRING,
      allowNull: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: true
    }, 
    email: {
      type: Sequelize.STRING,  
      allowNull: true,
      unique: 'compositeIndex'
    },
    active:{
      type: Sequelize.BOOLEAN,
      allowNull: false, 
      defaultValue: false
    }
  });

 
module.exports=Customer;



