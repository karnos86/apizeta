const conekta = require('../../bin/conexion_conekta');
module.exports={
    async indexPlan(req, res){
        try {
            let plan = await conekta.Plan.find();
             var array= plan["_json"].data
             array.forEach(element => {
                element["amount"]= parseFloat(element["amount"])/100;
            });
            res.json(array.reverse());
        } catch (error) {
            res.status(500).json(error)
        }

    }
}