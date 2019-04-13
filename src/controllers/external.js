const conekta = require('../../bin/conexion_conekta');
const asyn_request = require('async-request');
const xml2js  = require('xml2js');
const Customer = require('../models/Customer')
const Subscription = require('../models/Subscription')
const nodemailer = require('nodemailer');
const https = require('https');


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
         let cancel, notification, subscrition;

        try{
            switch (req.body.type) {
                case 'order.pending_payment':
                    let data = new Object();
                    data["reference"] = req.body.data.object.id
                    data["method"]='OXXO'
                    data["subscription"]=req.body.data.object.line_items.data[0].name
                    data["start"]=req.body.data.object.created_at
                    data["end"]= await CalculeTimeSubcription(req.body.data.object.line_items.data[0].name, req.body.data.object.created_at)
                    data["status"]='pending_payment'
                    data["idConekt"]= req.body.data.object.customer_info.customer_id
                    await Subscription.create(data);
                    res.json({status:200, message:"operacion exitosa"})
                    // res.json(data)
                break;
                case 'order.paid':
                    cancel = await Subscription.findAll({where:{idConekt:req.body.data.object.customer_info.customer_id}})
                    cancel.forEach( function(elemento, indice, array) {
                    if(elemento.status == 'active'){
                         expired = elemento;
                         expired.update({status:'expired'})
                        }
                        if( elemento.status == 'pending_payment'){
                            active = elemento;
                            active.update({status:'active', paid:true})
                        }
                    });
                    res.json({status:200, message:"operacion exitosa"})
                    break;
                case 'charge.paid':
                    console.log("eniar el coprovante por node mail",req.body.data);
                    res.json()
                    break;
                case 'subscription.paid':
                    // cancel = await Subscription.findAll({where:{idConekt:req.body.data.object.customer_id}})
                    // cancel.forEach( function(elemento, indice, array) {
                    //     if(elemento.status == 'active'){
                    //         expired = elemento;
                    //         expired.update({status:'expired'})
                    //     }
                    //     if(elemento.reference === req.body.data.object.id){
                    //         elemento.update({status:req.body.data.object.status, start:req.body.data.object.billing_cycle_start, end:req.body.data.object.billing_cycle_end});
                    //         res.json({status:200, message:"operacion exitosa"});
                    //     }
                    // });

                    // let subscriptionBack = new Object()
                    //     subscriptionBack["reference"] = req.body.data.object.id
                    //     subscriptionBack["method"] = "TDC"
                    //     subscriptionBack["subscription"] = req.body.data.object.plan_id
                    //     subscriptionBack["start"] =  req.body.data.object.billing_cycle_start
                    //     subscriptionBack["end"] = req.body.data.object.billing_cycle_end
                    //     subscriptionBack["paid"] =true 
                    //     subscriptionBack["status"] =req.body.data.object.status 
                    //     subscriptionBack["idConekt"] =req.body.data.object.customer_id 

                    // await Subscription.create(subscriptionBack);
                    notification = req.body.data.object;
                    console.log(notification.id)
                    var renovate = await Subscription.findById(notification.id);
                    subscrition = new Object()
                    subscrition["start"]    = notification.billing_cycle_start
                    subscrition["end"]      = notification.billing_cycle_end
                    subscrition["paid"]     = true 
                    subscrition["status"]   = notification.status

                    renovate.update(subscrition);

                    res.json({status:200, message:"operacion exitosa"});

                    break;
                case 'subscription.created':
                    notification = req.body.data.object;
                    var customer = await Customer.findOne({where:{idConekt:notification.customer_id}})
                    console.log(customer)
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

