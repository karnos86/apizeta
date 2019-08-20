const conekta = require('../../bin/conexion_conekta');
const bcrypt = require('bcrypt');
const asyn_request = require('async-request')
const Customer = require('../models/Customer');
const Subscription = require('../models/Subscription');
const Access = require('../models/Access');
const Checkout = require('../models/Checkout');


module.exports={
	async createTempRegistry(req , res){
		try{
			var data = req.body
			data["token"]=token();
			var save = await Checkout.create(req.body);
			res.status(200).json(save);
		}catch(error){
			res.status(420).json(error);
		}

	},
	async searchToken(req, res){
		try{
			var data = req.params.token
			var token = await Checkout.find({where:{'token':data, losing:true}});
			if(token){
				res.json({status:true, result:token});
			}else{
				res.json({status:false});
			}
		}catch(error){
			res.status(420).json(error);
		}
	},
	async losingToken(req, res){
		try{
			var data = req.params.token
			var token = await Checkout.find({where:{'token':data, losing:true}});
			if(token){
				token.update({losing:false});
				res.json({status:true});
			}else{
				res.json({status:false});
			}
		}catch(error){
			res.status(420).json(error);
		}
	}
}

function random() {
    return Math.random().toString(36).substr(2); // Eliminar `0.`
};
 
function token() {
    return random() + random()+ random()+ random(); // Para hacer el token más largo
};
 
