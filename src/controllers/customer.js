const conekta = require('../../bin/conexion_conekta');
const bcrypt = require('bcrypt');
const asyn_request = require('async-request');
const Customer = require('../models/Customer');
const Subscription = require('../models/Subscription');
const Access = require('../models/Access');



module.exports={
    async create(req, res){
        try {
           var data = req.body;
           console.log(data);
           let generar_nonce = await asyn_request(process.env.CNAME_EXTERNAL+'/api/get_nonce/?json=get_nonce&controller=user&method=register',{method: 'GET'});
           let nonce = JSON.parse(generar_nonce.body);
           console.log(nonce);
           if(nonce.status=="ok"){
               console.log(process.env.CNAME_EXTERNAL+'/api/user/register/?username='+data.username+'&email='+data.email+'&nonce='+nonce.nonce+'&display_name='+data.name+'&notify=both&user_pass='+data.password)
                var result = await asyn_request(process.env.CNAME_EXTERNAL+'/api/user/register/?username='+data.username+'&email='+data.email+'&nonce='+nonce.nonce+'&display_name='+data.name+'&notify=both&user_pass='+data.password,{method: 'GET'});
                wordpress = JSON.parse(result.body);
                console.log(wordpress)
                if(wordpress.status =='ok'){
                    let api_rest = await Customer.create({idWordPress:wordpress.user_id, email:data.email});
                    console.log(api_rest)
                    var customer_Conekta =  await conekta.Customer.create({
                        name: data.name,
                        email: data.email,
                        phone: '+52'+data.phone,
                        plan_id: data.plan,
                        payment_sources: payment_sources
                    });
                    res.json(customer_Conekta);
                }else{
                    res.status(400).json(wordpress)
                }
           }else{
               res.status(400).json(nonce)
           }
        } catch (error) {
            switch (error.http_code) {
                case 402:  
                    res.status(402).json(error.details[0].message);
                    break;
                default:
                console.log(error)
                    res.status(500).json(error)
                    break;
            }
            
        }
    },
    async createOxxo(req, res){
        try {
            var infoConekta = req.body.oxxo;
            var infoBack = req.body.custumer;
            infoBack["username"]=req.body.custumer.username.toLowerCase()
            infoBack["password"]=req.body.custumer.password.toLowerCase()
            let  search = await Customer.findOne({where:{'email': infoBack.email}})
            if(search == null){
                /*Registro el usuario en conekta */
                let customerConeckta = await conekta.Customer.create(infoConekta.customer_info[0]);
                infoConekta["customer_info"] = {customer_id:customerConeckta._id};
                infoBack["idConekt"] = customerConeckta._id;
                infoBack["active"] = true;
                let orden = await conekta.Order.create(infoConekta)
                if(orden != null){
                    /* Encripto el password */
                    let hash = bcrypt.hashSync(infoBack["password"], 10);
                    infoBack["password"] = hash;
                    // infoBack[
                    await Customer.create(infoBack);
                    res.json(orden["charges"]._json);
                }
            }else{
                res.json({message:'Email Registrado'})
            }
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    },
    async ckeckUsename(req, res){
       try {
           let result = await Customer.find({attributes: ['username'],where:{'username':req.body.username}});
           if(result==null){
                res.json(false);
           }else{
                res.json(true);
           }
       } catch (error) {
           res.status(500).json(error);
       }    
    },
    async ckeckEmail(req, res){
        try {
            let result = await Customer.find({attributes: ['email'],where:{'email':req.body.email}});
            if(result==null){
                res.json(false);
            }else{
                res.json(true);
            }
        } catch (error) {
            res.status(500).json(error);
        }    
    },
    async searchCustomer(req, res){
        try{
            let data = req.headers["authorization"].split(" ");
            let result = await Access.findOne({where:{uuii:data[1]}})
            let customer = await conekta.Customer.find(result.idConekt);  
            let info = new Object();
            if(customer.payment_sources==null){
                let oxxo = await Subscription.find({where:{idConekt: result.idConekt, status:'active'}});
                info["method"]=oxxo.method
                info["subscription"]=oxxo.subscription
                info["end"]=oxxo.end
                info["last4"]=null
                res.json(info);
            }else{
                info["method"]=customer.payment_sources._json.data[0].brand
                info["subscription"]=customer._json.subscription.plan_id
                info["end"]=customer._json.subscription.billing_cycle_end
                info["last4"]=customer.payment_sources._json.data[0].last4
                res.json(info);
            }  
        }catch(error){
            res.status(500).json(error);
        }
    },
    async updateCustomer(req, res){
        try{
            let data = req.headers["authorization"].split(" ");
            let result = await Access.findOne({where:{uuii:data[1]}})
            let customerback = await Customer.find({where:{idConekt:result.idConekt}});
            let customerConekta = await conekta.Customer.find(result.idConekt);
            let info = req.body;
            if(info.password){
                let hash = bcrypt.hashSync(info["password"], 10);
                info["password"]=hash
            }
            console.log(info)
           let rebac= await customerback.update(info);
           let recon= await customerConekta.update(info);
           console.log(rebac)
           console.log(recon)


            res.json(true);

        }catch(error){
            console.log(error)
            res.status(500).json(error);
        }
    },
    async renovarOxxo(req, res){
        try{
            let data = req.headers["authorization"].split(" ");
            let result = await Access.findOne({where:{uuii:data[1]}})
            let subscription = await Subscription.find({where:{idConekt:result.idConekt}});
            let plan = await conekta.Plan.find(subscription.subscription);
            let customer = await conekta.Customer.find(result.idConekt) 
            if(Object.keys(data).length != 0){
                await customer.subscription.cancel()
                await customer.payment_sources.get(0).delete()
            }
            let oxxo = new Object();
            oxxo["customer_info"] = {"customer_id":result.idConekt}
            oxxo["line_items"] = [{
                "name": plan._id,
                "unit_price": plan._json.amount,
                "quantity": 1
            }]
            oxxo["currency"] =  plan._json.currency
            oxxo["charges"] = [{"payment_method": {"type": "oxxo_cash"}}]
            let orden = await conekta.Order.create(oxxo)
            res.json(orden["charges"]._json);
        }catch(error){
            console.log(error)
            switch (error.http_code) {
                case 402:  
                    res.status(402).json(error.details[0].message);
                    break;
                default:
                    res.status(500).json(error)
                    break;
            }
        }
    }, 
    async renovarTdc(req, res){
        try{
            let data = req.headers["authorization"].split(" ");
            let result = await Access.findOne({where:{uuii:data[1]}})
            let subscription = await Subscription.find({where:{idConekt:result.idConekt}});
            let customer =  await conekta.Customer.find(result.idConekt);

            await customer.createPaymentSource({ type: "card", token_id: req.body.token })

            let subscriptionConeckt = await customer.createSubscription({plan:subscription.subscription});
                switch (subscriptionConeckt.status) {
                    case "active":
                        subscriptionConeckt["hide"]=true;
                        res.json(subscriptionConeckt);
                        break;
                    case "past_due":
                        let result = await customer.payment_sources.get(0).delete();
                        res.staus(422).json({message:"Pago no realizado, problemas con su TDC"});
                        break;
                    case "in_trial":
                        break;
                }
            res.json(respuesta)
        }catch(error){
            console.log(error)
            switch (error.http_code) {
                case 402:  
                    res.status(402).json(error.details[0].message);
                    break;
                default:
                    res.status(500).json(error)
                    break;
            }
        }
    }, 
    async indexSubscription(req, res){
        try{
            let index = await Subscription.findAll({include:[{all: true}], where:{status:'active'}})
            res.json(index)
        }catch(error){
            console.log(error)
            res.status(500).json(error)
        }
    }


}

