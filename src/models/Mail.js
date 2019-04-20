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
    }, 
    message:{
      type: Sequelize.STRING,
       allowNull: false
    }

  })

Customer.hasMany(Mail, {foreignKey: 'idWordPress'});
 Mail.belongsTo(Customer,{foreignKey: 'idWordPress'});


 
module.exports=Mail;