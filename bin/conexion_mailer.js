var nodemailer = require('nodemailer');
var smtpTransport = require("nodemailer-smtp-transport");

module.exports = nodemailer.createTransport(smtpTransport({
	pool: true,
    host : process.env.HOST_MAIL,
    port:  process.env.PORT_MAIL,
    secure: false,
    auth : {
        user : process.env.USER_MAIL,
        pass : process.env.PASS_MAIL
    }
   
}));