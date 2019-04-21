const conekta = require('../../bin/conexion_conekta');
const transporter = require('../../bin/conexion_mailer')
const asyn_request = require('async-request');
const xml2js  = require('xml2js');
const Customer = require('../models/Customer')
const Subscription = require('../models/Subscription')
const Mail = require('../models/Mail')
const Access = require('../models/Access')
const nodemailer = require('nodemailer');
const https = require('https');
const {  setIntervalAsync,  clearIntervalAsync } = require('set-interval-async/dynamic')


module.exports={
    async feedZeta(req, res){
        try {
            var data = await asyn_request('http://zetatijuana.com/feed/',{method: 'GET'})
            console.log(data.body)
            var parser = new xml2js.Parser();
            parser.parseString(data.body,(err,result)=>{
                if(err){
                    res.json(err);
                }
                console.log(result)
                res.json(result["rss"]["channel"][0].item);
            }) 
        } catch (error) {
            console.log(error)
            res.status(500).json(error);
        }
    },
    async weatherZeta(req, res){
        try {
            var data = await asyn_request('http://api.openweathermap.org/data/2.5/weather?q=Tijuana,Mxn&APPID=88844881a35724a841242f8e767f185a',{method: 'GET'})
            res.json(JSON.parse(data.body));
        } catch (error) {
            res.status(500).json(error)
        }
    },
    async moneyZeta(req, res){
        try { 
            var data = await asyn_request('https://forex.1forge.com/1.0.3/quotes?pairs=USDMXN,%20MXNUSD&api_key=h5pNjJV5gg40EyGsMcYPdbB8agpWFCkw',{method:'GET'})
            res.json(JSON.parse(data.body))
        } catch (error) {
            res.status(500).json(error)
        }
    },
    async hooksPaid(req, res){
         let cancel, notification, subscrition, customer, renovate,done, mail;

        try{
            switch (req.body.type) {
                 case 'customer.created':
                    info_customer_created = req.body.data.object;
                    customer_created = await Customer.findOne({where:{email:info_customer_created.email}});
                    await customer_created.update({idConekt: info_customer_created.id , active: true});
                     res.json({status:200, message:"operacion exitosa"});

                    break;
                case 'order.created':
                    let info_Order_created = req.body.data.object;
                    let customer_Order_created = await Customer.findOne({where:{idConekt:info_Order_created.customer_info.customer_id}})
                    let order_created= new Object()
                    order_created["reference"] = info_Order_created.id
                    order_created["method"] = "OXXO"
                    order_created["subscription"] = info_Order_created.line_items.data[0].name
                    // subscrition["status"] =notification.status 
                    order_created["paid"] =false
                    order_created["idWordPress"] =customer_Order_created.idWordPress;
                    await Subscription.create(order_created);
                    res.json({status:200, message:"operacion exitosa"});

                    break;
                case 'order.pending_payment':
                    let info_pending_payment = req.body.data.object;
                    const timer = setIntervalAsync( async () => { let order_pending_payment = await Subscription.findById(info_pending_payment.id); }, 2000)
                    if(order_pending_payment != null){
                        await clearIntervalAsync(timer)
                        let pending_payment = new Object()
                        pending_payment["start"]=info_pending_payment.created_at
                        pending_payment["end"]= await CalculeTimeSubcription(info_pending_payment.line_items.data[0].name, info_pending_payment.created_at)
                        pending_payment["status"]='pending_payment'
                    await order_pending_payment.update(pending_payment);
                    res.json({status:200, message:"operacion exitosa"})
                   }else{
                       res.json(order_pending_payment) 
                   }
                    
                    
                break;
                case 'order.paid':
                    let expired_order_paid, active_order_paid;
                    let info_order_paid = req.body.data.object;
                    let customer_order_paid = await Customer.findOne({where:{idConekt:info_order_paid.customer_info.customer_id}})
                    let cancel_order_paid = await Subscription.findAll({where:{idWordPress:customer_order_paid.idWordPress}})
                    cancel_order_paid.forEach( function(elemento, indice, array) {
                    if(elemento.status == 'active'){
                         expired_order_paid = elemento;
                         expired_order_paid.update({status:'expired'})
                        }
                        if( elemento.status == 'pending_payment'){
                            active_order_paid = elemento;
                            active_order_paid.update({status:'active', paid:true})
                        }
                    });
                    res.json({status:200, message:"operacion exitosa"})
                    break;
                case 'charge.created':
                    let info_charge_created = req.body.data.object;
                    let subscription_charge_created = await Subscription.findOne({where:{reference:info_charge_created.order_id}});
                    console.log(subscription_charge_created )
                    let customer_charge_created = await Customer.findOne({where:{idWordPress:subscription_charge_created.idWordPress}})
                    var mailOptions_charge_created= {
                        from: process.env.USER_MAIL,
                        to: customer_charge_created.email,
                        subject: 'Cargo Oxxo',
                        text: JSON.stringify(info_charge_created)
                    }
                    let done_charge_created = await transporter.sendMail(mailOptions_charge_created);
                    await Mail.create({id:done_charge_created.messageId, status:done_charge_created.response, message:JSON.stringify(info_charge_created),idWordPress:customer_charge_created.idWordPress})
                    res.json(done_charge_created);
                    break;
                case 'charge.paid':
                    let info_charge_paid = req.body.data.object;
                    let customer_charge_paid
                    if(info_charge_paid.customer_id != ''){
                        customer_charge_paid = await Customer.findOne({where:{idConekt:info_charge_paid.customer_id}});
                    }else{
                        let subscription_charge_paid = await Subscription.findOne({where:{reference:info_charge_paid.order_id}});
                        customer_charge_paid = await Customer.findOne({where:{idWordPress:subscription.idWordPress}});
                    }
                    
                    var mailOptions_charge_paid = {
                        from: process.env.USER_MAIL,
                        to: customer.email,
                        subject: 'Comprobante de Pago',
                        text: JSON.stringify(notification)
                    }
                
                    let done_charge_paid = await transporter.sendMail(mailOptions);
                    await Mail.create({id:done_charge_paid.messageId, status:done_charge_paid.response, message:JSON.stringify(notification),idWordPress:customer.idWordPress})
                    res.json(done_charge_paid);
                    break;
                case 'subscription.created':
                    notification = req.body.data.object;
                    customer = await Customer.findOne({where:{idConekt:notification.customer_id}})
                    subscrition = new Object()
                    subscrition["reference"] = notification.id
                    subscrition["method"] = "TDC"
                    subscrition["subscription"] = notification.plan_id
                    subscrition["status"] =notification.status 
                    subscrition["paid"] =false
                    subscrition["idWordPress"] =customer.idWordPress;
                    await Subscription.create(subscrition);
                    res.json({status:200, message:"operacion exitosa"});
                    break
                case 'subscription.payment_failed':
                    notification = req.body.data.object;
                    var payment_failed = await Subscription.findById(notification.id);
                    subscrition = new Object()
                    subscrition["end"]      = notification.billing_cycle_end
                    subscrition["status"]   = notification.status
                    await payment_failed.update(subscrition);
                    res.json({status:200, message:"operacion exitosa"});

                    break;
                case 'subscription.paid':
                    notification = req.body.data.object;
                    var paid = await Subscription.findById(notification.id);
                    subscrition = new Object()
                    subscrition["start"]    = notification.billing_cycle_start
                    subscrition["end"]      = notification.billing_cycle_end
                    subscrition["paid"]     = true 
                    subscrition["status"]   = notification.status
                    await paid.update(subscrition);
                    res.json({status:200, message:"operacion exitosa"});
                    break;
                case 'subscription.canceled':
                    notification = req.body.data.object;
                    var canceled = await Subscription.findById(notification.id);
                    subscrition = new Object()
                     subscrition["end"]      = notification.billing_cycle_end
                    subscrition["status"]   = notification.status
                    await canceled.update(subscrition);
                    res.json({status:200, message:"operacion exitosa"});

                    break;
                default:
                     res.json({status:200, message:"operacion no tomada en cuenta"})
                    break;
            }
        }catch(error){
            console.log(error)
            res.status(500).json({status:500, message:"Ocurrio un Error", error:error})
        } 
    },
    async listVideo(req, res){
        try{
            var data = await asyn_request('https://www.googleapis.com/youtube/v3/playlistItems?key=AIzaSyBYYx0g6DgwDeZYVM4dDuW9hq4b-VlIiYA&playlistId=UU-NHHkALnId41yENpdCuLKQ&part=snippet,id&maxResults=12',{method: 'GET'})
            var json = JSON.parse(data.body)
            res.json(json["items"]);
        }catch(error){
            res.status(500).json(error)
        }
    },
    async resendMail(req, res){
        try{

            let data = req.headers["authorization"].split(" ");
            let result = await Access.findOne({where:{uuii:data[1]}})
            let api_rest = await Customer.findOne({where:{idWordPress:result.idWordPress}})
            let mail = await Mail.findAll({where:{idWordPress:result.idWordPress}, order:[['createdAt','DESC']],})
            var ultimo = mail[0];
            var mailOptions = {
              from: process.env.USER_MAIL,
              to: api_rest.email,
              subject: 'renvio',
              text: ultimo.message
            }
            let done = await transporter.sendMail(mailOptions)
            res.json(done)
    }catch(error){
      console.log(error)
      res.status(500).json(error)
    }
 } 
 
}

async function CalculeTimeSubcription(type, start){
    let plan = await conekta.Plan.find(type);
    switch(plan._json.interval){
        case "month":
            var end = new Date(start*1000);
            end.setDate(end.getDate()-1);
            end.setMonth(end.getMonth()+1);
            var unixtime = end.getTime()/1000;
            return unixtime;
        break;
        case "year":
            var end = new Date(start*1000);
            end.setDate(end.getDate()-1);
            end.setFullYear(end.getFullYear()+1);
            var unixtime = end.getTime()/1000;
            return unixtime;   
        break;
    }    
}

async function bodyEmail(from, data){
    try{
        let mailOptions = {
            from: from,
            to: process.env.USER_MAIL,
            subject: data.subect,
            html: '<h1>Hola mundo!</h1>' 
        };
    }catch(error){
        return error
    }
}


// 

//         transporter.sendMail(mailOptions, (error, info) => {
//             if (error) {
//                 console.log('Error', error);
//             }
//             else{
//                 console.log('Success', info);
//             }
//         });

