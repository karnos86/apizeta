const conekta = require('../../bin/conexion_conekta');
const Customer = require('../models/Customer');
const Subscription = require ('../models/Subscription');
module.exports={
    async searchSubscritions(req, res){
        try {
            console.log(req.body);
            let data = req.body
            if(data.method=='TDC'){
                console.log(data.idConekt)
                let tdc = await conekta.Customer.find(data.idConekt);
                res.json({method:'TDC', data:tdc._json})
            }else{
                console.log(data.reference)
                let oxxo = await conekta.Order.find(data.reference)
                res.json({method:'OXXO', data:oxxo})
            }
        } catch (error) {
            console.log(error)
            res.status(500).json(error)
        } 
    },
     async indexSubscription(req, res){
         // , where:{status:'active'}
        try{
            let index = await Subscription.findAll({include:[{all: true}]})
            res.json(index)
        }catch(error){
            console.log(error)
            res.status(500).json(error)
        }
    },
 
    async listSubscriptionsUsername(req, res){
        try{
            let info =  await Customer.findOne({where:{username:req.body.username},include:[{model: Subscription}]})
            if(info ==null){
                res.status(404).json({message:'Usuario no encontrado'})
            }
            res.json(info)
        }catch(error){
            console.log(error);
            res.status(500).json(error)
        }
    }

}