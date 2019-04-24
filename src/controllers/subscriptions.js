const conekta = require('../../bin/conexion_conekta');
const Customer = require('../models/Customer');
module.exports={
    async searchSubscritions(req, res){
        try {
            console.log(req.body);
            let data = req.body
            if(data.method=='TDC'){
                let customer = await Customer.findById(data.idWordPress);
                let tdc = await conekta.Customer.find(customer.idConekt);
                res.json(tdc)
            }else{
                let oxxo = await conekta.Orden.find(data.reference)
                console.log(oxxo);
                res.json(oxxo)
            }
        } catch (error) {
            console.log(error)
            res.status(500).json(error)
        } 
    }

}