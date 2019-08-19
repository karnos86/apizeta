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
			var save = await Checkout.create(data);
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
