const Sequelize = require('sequelize');
const db = require('../../bin/database');
const Subcription = require('./Subcription');


  const Mail= db.define('mail', {
     id: {
        type: Seq.STRING,
        allowNull: false, 
        primaryKey: true
    },
    status:{
        type: Sequelize.STRING,
        allowNull: false
    }

  })

Subcription.hasMany(Mail,{foreignKey: 'reference'});
 Mail.belongsTo(Subcription, {foreignKey: 'reference'});

 
module.exports=Mail;