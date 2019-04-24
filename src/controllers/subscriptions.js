const conekta = require('../../bin/conexion_conekta');
const Customer = require('../models/Customer');
module.exports={
    async searchSubscritions(req, res){
        let data = req.body
        if(data.method=='OXXO'){
            let oxxo = await conekta.Orden.find(data.reference)
            console.log(oxxo);
            res.json(oxxo)
        }else{
            let customer = await Customer.findById(data.idWordPress);
            let tdc = await conekta.Customer.find(customer.idConekt);
            res.json(tdc)

        }
    }

}