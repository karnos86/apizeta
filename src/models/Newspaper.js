const Sequelize = require('sequelize');
const db = require('../../bin/database');

  const Newspaper= db.define('newspaper', {
    code:{
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
      unique: 'compositeIndex'
    },
    date:{
      type: Sequelize.STRING,
      allowNull: false, 
    },
    front:{
      type: Sequelize.STRING,
      allowNull: true,
    },
    document:{
      type: Sequelize.STRING,
      allowNull: true,
    }
  });

 
module.exports=Newspaper;
