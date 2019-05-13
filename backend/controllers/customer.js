const conekta = require('../../bin/conexion_conekta');
const bcrypt = require('bcrypt');
const asyn_request = require('async-request')
const Customer = require('../models/Customer');
const Subscription = require('../models/Subscription');
const Access = require('../models/Access');




module.exports={
    async create(req, res){
        try {
            var data = req.body;
            console.log(data)
            let generar_nonce = await asyn_request(process.env.CNAME_EXTERNAL+'/api/get_nonce/?json=get_nonce&controller=user&method=register',
               {method: 'GET'}, 
               {headers: {'Accept': 'application/json','Accept-Charset': 'utf-8',}},
               {maxRedirects:1000});
           let nonce = JSON.parse(generar_nonce.body);
           console.log(nonce);
           if(nonce.status=="ok"){
               var name = data.name.split(' ').join('%20')
               console.log(process.env.CNAME_EXTERNAL+'/api/user/register/?username='+data.username+'&email='+data.email+'&nonce='+nonce.nonce+'&display_name='+name+'&notify=both&user_pass='+data.password)
                var result = await asyn_request(process.env.CNAME_EXTERNAL+'/api/user/register/?username='+data.username+'&email='+data.email+'&nonce='+nonce.nonce+'&display_name='+data.name+'&notify=both&user_pass='+data.password,{method: 'GET'});
                if(result.statusCode == 200){
                    wordpress = JSON.parse(result.body);
                    if(wordpress.status =='ok'){
                        let api_rest = await Customer.create({idWordPress:wordpress.user_id, email:data.email, username:data.username});
                        console.log(api_rest)
                        var customer_Conekta =  await conekta.Customer.create({
                            name: data.name,
                            email: data.email,
                            phone: '+52'+data.phone,
                            plan_id: data.plan,
                            payment_sources: data.payment_sources
                        });
                        await api_rest.update({idConekt:customer_Conekta._id , active: true})
                        res.json(customer_Conekta.subscription._json);
                    }else{
                        res.status(400).json(wordpress)
                    }
                }else{
                    res.status(500).json({message:'No se pudo procesar... Soporte fue notificado'})
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
    async personalTdc(req, res){
        try{
            let data = req.body;
            let api_rest = await Customer.create({idWordPress:data.wordpress, email:data.email, username:data.username})
            var customer_Conekta =  await conekta.Customer.create(data);
            await api_rest.update({idConekt:customer_Conekta._id , active: true})
            res.json(customer_Conekta.subscription._json);
        }catch(error){
            console.log(error)
            res.status(500).json(error)
        }
    },
    async createOxxo(req, res){
        try {
            var data = req.body
            let generar_nonce = await asyn_request(process.env.CNAME_EXTERNAL+'/api/get_nonce/?json=get_nonce&controller=user&method=register',{method: 'GET'});
            let nonce = JSON.parse(generar_nonce.body);
            console.log(nonce);
            if(nonce.status=="ok"){
                var name = data.name.split(' ').join('%20');
               console.log(process.env.CNAME_EXTERNAL+'/api/user/register/?username='+data.username+'&email='+data.email+'&nonce='+nonce.nonce+'&display_name='+name+'&notify=both&user_pass='+data.password)
                var result = await asyn_request(process.env.CNAME_EXTERNAL+'/api/user/register/?username='+data.username+'&email='+data.email+'&nonce='+nonce.nonce+'&display_name='+name+'&notify=both&user_pass='+data.password,{method: 'GET'});
                wordpress = JSON.parse(result.body);
                if(wordpress.status =='ok'){
                    let api_rest = await Customer.create({idWordPress:wordpress.user_id, email:data.email, username:data.username});
                    let customer = await conekta.Customer.create(data.oxxo.customer_info[0])
                    await api_rest.update({idConekt: customer._id , active: true});
                    data.oxxo["customer_info"] = {customer_id:customer._id};
                    let orden = await conekta.Order.create(data.oxxo)
                    res.json(orden["charges"]._json);

                }else{
                    res.status(420).json(wordpress.error);
                }
            }else{
                res.status(420).json(nonce.error);
            }
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    },
    async personalOxxo(req, res){
        try{
           let data = req.body;
           let conekt = await conekta.Customer.create(data.customer_info[0]);
           await Customer.create({idWordPress: data.wordpress, idConekt: conekt._id, email:data.customer_info[0].email, username:data.username});
           data["customer_info"] = {customer_id: conekt._id};
           delete data["wordpress"];
           let orden = await conekta.Order.create(data);
           res.json(orden["charges"]._json);
        }catch(error){
            console.log(error)
            res.status(500).json(error)
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
            let data = req.headers["authorization"];
            let result = await Access.findOne({where:{uuii:data}})
            let api_rest = await Customer.findOne({where:{idWordPress:result.idWordPress}})
            let customer = await conekta.Customer.find(api_rest.idConekt);  
            let info = new Object();
            if(customer.payment_sources==null){
                let oxxo = await Subscription.find({where:{idWordPress:result.idWordPress, status:'active'}});
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
            let UUII = req.headers["uuii"];
            let auth = req.headers["authorization"]
            let result = await Access.findOne({where:{uuii:UUII}})
            let data = req.body
            let wordpress = await asyn_request('https://zetatijuana.com/wp-json/wp/v2/users/'+result.idWordPress,{method: 'POST', data:data,
                headers:{'Content-Type':'application/json', 'Authorization':auth}})
            let rest_api = await Customer.find({where:{idWordPress:result.idWordPress}});
            let conekt = await conekta.Customer.find(result.idConekt);           
            let rebac= await rest_api.update(data);
            let recon= await conekt.update(data);
            res.json(true);
        }catch(error){
            console.log(error)
            res.status(500).json(error);
        }
    },
    async renovarOxxo(req, res){
        try{
            let data = req.headers["uuii"];
            let result = await Access.findOne({where:{uuii:data}})
            let api_rest = await Customer.findOne({where:{idWordPress:result.idWordPress}})
            let subscription = await Subscription.find({where:{idWordPress:result.idWordPress}});
            let plan = await conekta.Plan.find(subscription.subscription);
            let customer = await conekta.Customer.find(api_rest.idConekt) 
            if(customer._json.subscription.status =='active'){
                await customer.subscription.cancel()
            }
            if(customer._json.payment_sources){
                await customer.payment_sources.get(0).delete()
            }
            let oxxo = new Object();
            oxxo["customer_info"] = {"customer_id":api_rest.idConekt}
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
            let data = req.headers["uuii"];
            let result = await Access.findOne({where:{uuii:data}})
            let api_rest = await Customer.findOne({where:{idWordPress:result.idWordPress}})
            let subscription = await Subscription.find({where:{idWordPress:result.idWordPress}});
            let customer =  await conekta.Customer.find(api_rest.idConekt);
            await customer.payment_sources.get(0).delete()
            await customer.createPaymentSource({ type: "card", token_id: req.body.token })
            let subscriptionConeckt = await customer.createSubscription({plan:subscription.subscription});  
            res.json(subscriptionConeckt);      
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
    async changeTdc(req, res){
        try{
            let data = req.body
            let customer =  await conekta.Customer.find(data.customer_id);
            await customer.payment_sources.get(0).delete()
            await customer.createPaymentSource({ type: "card", token_id: data.token})
            let susbscrition = await customer.createSubscription({plan: customer._json.subscription.plan_id});
            res.json(susbscrition)
        }catch(error){
            console.log(error)
            res.status(500).json(error)
        }
    },
    async changeOxxo(req, res){
        try{
            let data = req.body
            let customer = await conekta.Customer.find(data.customer_id) 
            if(customer._json.subscription.status =='active'){
                await customer.subscription.cancel()
            }
            if(customer._json.payment_sources){
                await customer.payment_sources.get(0).delete()
            }
            let api_rest = await Customer.findOne({where:{idConekt:data.customer_id}});
            let subscription = await Subscription.find({where:{idWordPress:api_rest.idWordPress}});
            let plan = await conekta.Plan.find(subscription.subscription);
            let oxxo = new Object();
            oxxo["customer_info"] = {"customer_id":data.customer_id}
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
            res.status(500).json(error)
        }
    },
    async indexCustomer(req, res){
        try {
            let customers = await Customer.findAll({include:[{all: true}],})
            res.json(customers)

        }catch(error){
            console.log(error)
            res.status(500).json(error)
        }
    }
    


}

