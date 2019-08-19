const Sequelize = require('sequelize');
const db = require('../../bin/database');

const Checkout = db.define('temp_registi',{
	id:{
		type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
	},
	token:{
		type:Sequelize.STRING,
		allowNull: true
	},
	phone:{
		type:Sequelize.STRING,
		allowNull: true
	},
	data:{
		type:Sequelize.STRING,
		allowNull: true
	},
	origin:{
		type:Sequelize.STRING,
		allowNull: true
	},
	losing:{
		type: Sequelize.BOOLEAN,
      	allowNull: true, 
      	defaultValue: true
	}
});
module.exports = Checkout;