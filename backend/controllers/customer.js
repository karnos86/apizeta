const conekta = require('../../bin/conexion_conekta');
const bcrypt = require('bcrypt');
const asyn_request = require('async-request')
const Customer = require('../models/Customer');
const Subscription = require('../models/Subscription');
const Access = require('../models/Access');




module.exports={
    async newCustumerTDC (req, res){
        try{
            var data  = req.body;
            var customer = await Customer.findOne({where:{username:data["username"], email:data["email"]}});
            if(!customer){
                let generar_nonce = await asyn_request(process.env.CNAME_EXTERNAL+'/api/get_nonce/?json=get_nonce&controller=user&method=register',
                    {method: 'GET'}, 
                    {headers: {'Accept': 'application/json','Accept-Charset': 'utf-8',}},
                    {maxRedirects:1000});
                if(generar_nonce.statusCode==503){
                    res.status(503).json({ message:'Solicitud no autorizada Zetatijuana.com', authorized:false});
                }
                let nonce = JSON.parse(generar_nonce.body);
                if(nonce.status=="ok"){
                    var name = data.name.split(' ').join('%20')
                    var result = await asyn_request(process.env.CNAME_EXTERNAL+'/api/user/register/?username='+data.username+'&email='+data.email+'&nonce='+nonce.nonce+'&display_name='+data.name+'&notify=both&user_pass='+data.password,{method: 'GET'});
                    if(result.statusCode==503){
                        res.status(503).json({ message:'Solicitud no autorizada Zetatijuana.com', authorized:false});
                    }
                    if(result.statusCode == 200){
                        wordpress = JSON.parse(result.body);
                        if(wordpress.status =='ok'){
                            let api_rest = await Customer.create({idWordPress:wordpress.user_id, email:data.email, username:data.username});
                            var customer_Conekta =  await conekta.Customer.create({
                                name: data.name,
                                email: data.email,
                                phone: '+52'+data.phone,
                                plan_id: data.plan,
                                payment_sources: data.payment_sources
                            });
                            console.log(customer_Conekta)
                            await api_rest.update({idConekt:customer_Conekta._id , active: true})
                            res.json(customer_Conekta.subscription._json);
                        }else{
                            res.status(420).json(wordpress)
                        }
                    }else{
                        if(result.statusCode == 404){
                        var data = JSON.parse(result.body)
                        res.status(420).json(data.error);
                        }else{
                        res.status(500).json({message:'Soporte ya fue notificado'});
                        }
                    } 
                }else{
                    res.status(400).json(nonce)
                } 
            }else{
                let customer_conekta = await conekta.Customer.find(customer["idConekt"]);
                console.log(data.payment_sources[0]);
                await customer_conekta.subscription.cancel();
                //await customer_conekta.payment_sources.get(0).delete
                let payment = await customer_conekta.createPaymentSource(data.payment_sources[0]);
                console.log("pago",payment);
                console.log({ plan: data["plan"], card:payment["id"]});
                let result = await customer_conekta.createSubscription({ plan: data["plan"], card:payment["id"]});
                console.log("actualizado",result)
                res.status(200).send(result);
            }
        }catch(error){
            console.log(error)
            switch (error.http_code) {
                case 402:  
                    res.status(402).json(error.details[0].message);
                    break;
                default:
                    console.log(error)
                    res.status(500).json(error);
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
            if(generar_nonce.statusCode == 503){
                res.status(503).json({ message:'Solicitud no autorizada Zetatijuana.com'});
            }
            let nonce = JSON.parse(generar_nonce.body);
            console.log(nonce);
            if(nonce.status=="ok"){
                var name = data.name.split(' ').join('%20');
               console.log(process.env.CNAME_EXTERNAL+'/api/user/register/?username='+data.username+'&email='+data.email+'&nonce='+nonce.nonce+'&display_name='+name+'&notify=both&user_pass='+data.password)
                var result = await asyn_request(process.env.CNAME_EXTERNAL+'/api/user/register/?username='+data.username+'&email='+data.email+'&nonce='+nonce.nonce+'&display_name='+name+'&notify=both&user_pass='+data.password,{method: 'GET'});
                if(result.statusCode==503 ){
                    res.status(503).json({ message:'Solicitud no autorizada Zetatijuana.com'});
                }
                console.log()
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
            let subscripcion = await Subscription.findAll({where:{idWordPress:result.idWordPress, $or: [{status:'active'},{status:'pending_payment'}]},order: [['createdAt', 'DESC']]});
            let info = {method:null,subscription:null,end:null,last4:null};
            if(subscripcion[0].method === "OXXO"){
                info["method"]=subscripcion[0].method;
                info["subscription"]=subscripcion[0].subscription;
                info["end"]=subscripcion[0].end;
                info["last4"]=subscripcion[0].status;
                res.json(info);
            }else{
                let customer = await conekta.Customer.find(api_rest.idConekt)
                console.log(customer)
                
                info["method"]=customer.payment_sources._json.data[0].brand
                info["subscription"]=customer._json.subscription.plan_id
                info["end"]=customer._json.subscription.billing_cycle_end
                info["last4"]=customer.payment_sources._json.data[0].last4
                res.json(info);
            }
        }catch(error){
            console.log(error)
            res.status(500).json(error);
        }
    },
    async updateCustomer(req, res){
        try{
            let UUII = req.headers["authorization"]
            let auth = req.body.token
            delete req.body.token;
            let result = await Access.findOne({where:{uuii:UUII}})
            let data = req.body
            let wordpress = await asyn_request('https://zetatijuana.com/wp-json/wp/v2/users/'+result.idWordPress,{method: 'POST', data:data,
                headers:{'Content-Type':'application/json', 'Authorization':auth}})
            console.log(wordpress)
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
            let data = req.headers["authorization"];
            console.log(data)
            let result = await Access.findOne({where:{uuii:data}})
            console.log(result)
            let api_rest = await Customer.findOne({where:{idWordPress:result.idWordPress}})
            let subscription = await Subscription.find({where:{idWordPress:result.idWordPress}});
            let plan = await conekta.Plan.find(subscription.subscription);
            let customer = await conekta.Customer.find(api_rest.idConekt) 
            console.log('primer if',customer._json.subscription.status)
            if(customer._json.subscription.status =='active'){
                await customer.subscription.cancel()
            }
            console.log('segundo if',customer._json.payment_sources)
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
            let data = req.headers["authorization"] ;
            let result = await Access.findOne({where:{uuii:data}})
            console.log(result)
            let api_rest = await Customer.findOne({where:{idWordPress:result.idWordPress}})
            console.log(api_rest)
            let subscription = await Subscription.find({where:{idWordPress:result.idWordPress}});
            console.log(subscription)
             let customer =  await conekta.Customer.find(api_rest.idConekt);
            if(subscription.method == 'TDC'){
                await customer.payment_sources.get(0).delete()  
            }
            let tdc = await customer.createPaymentSource({ type: "card", token_id: req.body.token });
            let subscriptionConeckt = await customer.createSubscription({plan:subscription.subscription, card:tdc["id"]});
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

