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
      login = req.body;
      let customer = await Customer.findOne({include:[{all: true}], where:{email: done.user_email}});
      if(customer){
           let subscription = await validateSubscrition(customer.subcriptions) ;
           if(subscription){
               let access = await Access.findOne({where:{uuii:login.UUII}});
               if(access != null){
                   await access.update({'authorized':true, 'idWordPress':customer.idWordPress});
                   res.json({status:200, authorized:true});
               }else{
                   await Access.create({'uuii':login.UUII,'authorized':true, 'idWordPress':customer.idWordPress});
                   res.json(true);
               }
               let listAccess = await Access.findAll({where:{idWordPress:customer.idWordPress}});
               for(let i in listAccess){
                   if(listAccess[i].uuii != login.UUII){ 
                       await listAccess[i].update({authorized:false});
                   }
               }
             }else{
                res.json({status: 402, message:'Suscripción no debitada! Seleccione un metodo de pago', idConekt:customer.idConekt, authorized:false});
             }  
      }else{
        res.json({status: 404, message:'No tiene subscripción, seleccione una!', idWordPress:done.user, authorized:false});
      }
    } catch (error) {
        console.log(error)
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
        var data = await asyn_request('https://zetatijuana.com/api/user/generate_auth_cookie/?username='+login.username+'&password='+login.password,{method: 'GET', cookieJar: true});
        console.log(data)
        var done =JSON.parse(data.body)
        console.log(done)
        if(done.status=='ok'){
          if(done.user.capabilities.administrator){
            res.json(done);
          }else{
            res.status(401).json({message: 'no autorizado'});
          }
        }else{
          res.status(402).json({message: done.message});
        }
        
         
    } catch (error) {
      console.log(error)
      res.status(500).json(error);
    } 
  },
  async validateCookieWorpress(req, res, next){
    try{
      if(req.headers["authorization"] == null){
        res.status(401).send({message:"Operacion no permitida"})
      }
      let cookie = req.headers["authorization"].split(" ");
      let data = await asyn_request('https://zetatijuana.com/api/user/validate_auth_cookie/?cookie='+cookie[1],{method: 'GET'})
      console.log(data)
      let info = JSON.parse(data.body);
      if(info.status == 'ok' && info.valid == true){
        next()
      }else{
        res.status(401).json({message: 'no autorizado'})
      }
    }catch(error){
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