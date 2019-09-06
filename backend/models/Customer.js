const Sequelize = require('sequelize');
const db = require('../../bin/database');

    

  const Customer= db.define('customer', {
    idWordPress:{
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: true,
      unique: 'compositeIndex'
    },
    idConekt:{
      type: Sequelize.STRING,
      allowNull: true,
      unique: 'compositeIndex'
    },
    username: {
      type: Sequelize.STRING,  
      allowNull: true,
      unique: 'compositeIndex'
    },
    email: {
      type: Sequelize.STRING,  
      allowNull: true,
      unique: 'compositeIndex'
    },
    active:{
      type: Sequelize.BOOLEAN,
      allowNull: false, 
      defaultValue: true
    }
  });

 
module.exports=Customer;






