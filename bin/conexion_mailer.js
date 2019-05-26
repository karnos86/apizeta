var nodemailer = require('nodemailer');
var smtpTransport = require("nodemailer-smtp-transport");
 module.exports = {
   async start(){
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
        let template = new EmailTemplate(path.join(__dirname, 'backend/emails', templateName));
        return Promise.all(contexts.map((context) => {
            return new Promise((resolve, reject) => {
                template.render(context, (err, result) => {
                    if (err) reject(err);
                    else resolve({
                        email: result,
                        context,
                    });
                });
            });
        }));
    }
 } 