var nodemailer = require('nodemailer');
var smtpTransport = require("nodemailer-smtp-transport");

module.exports = nodemailer.createTransport(smtpTransport({
	// pool: true,
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
   
}));