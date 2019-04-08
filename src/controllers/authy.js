const conekta = require('../../bin/conexion_conekta');
const Customer = require('../models/Customer');
const Subscription = require('../models/Subscription');
const User = require('../models/User');
const Access = require('../models/Access');
const bcrypt = require('bcrypt');
const asyn_request = require('async-request');
module.exports={
  async loginApp(req, res){
    try {
        let data = req.body;
        data["username"]=req.body.username.toLowerCase()
        data["password"]=req.body.password.toLowerCase()
        let customer = await Customer.findOne({include:[{all: true}], where:{username:data.username}});
         if(customer){
            const match = await bcrypt.compareSync(data.password, customer.password);
            if(match){
                let subscription = await validateSubscrition(customer.subcriptions) ;
                if(subscription){
                    let access = await Access.findOne({where:{uuii:data.UUII}});
                    if(access != null){
                        await access.update({'authorized':true, 'idConekt':customer.idConekt});
                        res.json(true);
                    }else{
                        await Access.create({'uuii':data.UUII,'authorized':true, 'idConekt':customer.idConekt});
                        res.json(true);
                    }
                    let listAccess = await Access.findAll({where:{idConekt:customer.idConekt}});
                    for(let i in listAccess){
                        if(listAccess[i].uuii != data.UUII){ 
                            await listAccess[i].update({authorized:false});
                        }
                    }
                  }else{
                      res.status(401).json({message:'No tiene suscripcion activa'});
                  }  
            }else{
               res.status(401).json({message:'Usuario y/o contraseña incorrectos'});
            }
        }else{
            res.status(401).json({message:'Usuario y/o contraseña incorrectos'});
        }    
    } catch (error) {
        res.status(500).json(error);
    }
  },
  async accessApp(req, res, next){
    try{
      if(req.headers["authorization"] == null){
        res.status(401).send({message:"Operacion no permitida"})
      }
      let data = req.headers["authorization"].split(" ");
      console.log(data)
      let result = await Access.findOne({where:{uuii:data[1]}})
      if(result == null){
        res.status(401).send({message:"Operacion no permitida"})
      }
      if(result.authorized){
          next()
      }else{
        res.status(403).json({message:"Se permite una session por dispositivo", page:"LoginPage"})
      }

    }catch(error){
       console.log(error).
       res.status(500).json(error)
    }   
  },
  async loginControl(req, res){
    try {
      login = req.body;
        var data = await asyn_request('https://zetatijuana.com/api/user/generate_auth_cookie/?username='+login.username+'&password='+login.password,{method: 'GET'});
        console.log(data)
        res.json(JSON.parse(data.body));    
    } catch (error) {
      console.log(error)
      res.status(500).json(error);
    } 
  }
}
async function validateSubscrition(array){
    let active
    array.forEach( function(elemento, indice, array) {
       if(elemento.status == 'active'){
             active = elemento;
       }
    });
    if(active != null){
        var validar = new Date();
        var end = new Date(active.end*1000);
        var resultado = end > validar;
        if(resultado){
           return resultado;
        }else{ 
           let deactivate = await Subscription.findById(active.reference);
           await deactivate.update({status:'expired'})
           return resultado;
        }
    }else{
        return false;
    }  
}




/*
 
                    
                  
                      
                
*/