var nodemailer = require('nodemailer');
var smtpTransport = require("nodemailer-smtp-transport");
const EmailTemplate = require('email-templates').EmailTemplate,
    path = require('path'),
    Promise = require('bluebird');
 module.exports = {
    start(){
        return nodemailer.createTransport(smtpTransport({
            service : process.env.HOST_MAIL,
            port:  process.env.PORT_MAIL,
            secure: false,
            requireTLS: true, //Force TLS
            tls: {  
                rejectUnauthorized: false
            },
            auth : {
                user : process.env.USER_MAIL,
                pass : process.env.PASS_MAIL
            }
        }))
    },
    loadTemplate (templateName, contexts) {
        return EmailTemplate(path.join(__dirname, 'backend/emails/', templateName));
        // return Promise.all(contexts.map((context) => {
        //     return new Promise((resolve, reject) => {
        //         template.render(context, (err, result) => {
        //             if (err) reject(err);
        //             else resolve({
        //                 email: result,
        //                 context,
        //             });
        //         });
        //     });
        // }));
    }
 } 