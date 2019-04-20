const Sequelize = require('sequelize');
const db = require('../../bin/database');
const Customer = require('./Customer');


  const Mail= db.define('mail', {
     id: {
        type: Sequelize.STRING,
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