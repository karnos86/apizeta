var conekta = require('conekta');
 
conekta.api_key = process.env.KEY_DEBBUG_CONEKTA;
conekta.locale = 'es';
conekta.api_version = '2.0.0';


module.exports = conekta;