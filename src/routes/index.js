var express = require('express');
var router = express.Router();
const ctrl = require('../controllers/')


router.get('/', function (req, res, next) {
  res.sendfile('./public/index.html')
})




router.post('/ctl/login', ctrl.authy.loginControl);
router.post('/ctl/prueba', ctrl.authy.validateCookieWorpress);

/*CRUD Customer */
//app
router.post('/api/customer/tdc', ctrl.customer.create);
router.post('/api/customer/oxxo', ctrl.customer.createOxxo);
router.post('/api/customer/ckeck/username', ctrl.customer.ckeckUsename);
router.post('/api/customer/ckeck/email', ctrl.customer.ckeckEmail);
router.get('/api/customer/find', ctrl.authy.accessApp, ctrl.customer.searchCustomer);
router.post('/api/customer/update', ctrl.authy.accessApp, ctrl.customer.updateCustomer);
router.post('/api/customer/renovate/oxxo', ctrl.authy.accessApp, ctrl.customer.renovarOxxo);
router.post('/api/customer/renovate/tdc', ctrl.authy.accessApp, ctrl.customer.renovarTdc);
router.post('/api/customer/change/tdc', ctrl.customer.changeTdc);
router.post('/api/customer/change/oxxo', ctrl.customer.changeOxxo);
router.post('/api/customer/personal/tdc', ctrl.customer.personalTdc);
router.post('/api/customer/personal/oxxo', ctrl.customer.personalOxxo);

//web
router.get('/subscription/index', ctrl.authy.validateCookieWorpress, ctrl.customer.indexSubscription);
router.get('/customer/search/worpress/:id',ctrl.authy.validateCookieWorpress,ctrl.customer.SearchWorpressCustomer);
router.post('/subscriptions/Conekta', ctrl.authy.validateCookieWorpress, ctrl.subscriptions.searchSubscritions);

/*Authy manejo de session*/
router.post('/api/customer/login', ctrl.authy.loginApp);

/*CRUD Plan */
router.get('/api/plan/index', ctrl.plan.indexPlan);

/* Get Feed transform Xml a Json */
router.get('/api/feed', ctrl.authy.accessApp ,ctrl.external.feedZeta);

/*Get de clima de openweathermap */
router.get('/api/widget',ctrl.authy.accessApp, ctrl.external.weatherZeta);
router.get('/api/money', ctrl.authy.accessApp,ctrl.external.moneyZeta);
router.get('/api/multimedia',ctrl.authy.accessApp, ctrl.external.listVideo);
router.get('/api/resendMail',ctrl.authy.accessApp, ctrl.external.resendMail);

/*Escucha de eventtos de conekta*/
router.post('/api/notification/conekta', ctrl.external.hooksPaid);

/**
* Crud de edicciones
*/
// web
// ctrl.authy.validateCookieWorpress
router.post('/create/edition', ctrl.authy.validateCookieWorpress,  ctrl.newspaper.createNewspaper);
router.get('/list/edition', ctrl.authy.validateCookieWorpress, ctrl.newspaper.indexAll);
router.get('/remove/edition/:code', ctrl.authy.validateCookieWorpress,  ctrl.newspaper.deleteNewspaper);
router.get('/remove/front/:code',ctrl.authy.validateCookieWorpress,  ctrl.newspaper.deleteFront)
router.get('/remove/document/:code', ctrl.authy.validateCookieWorpress, ctrl.newspaper.deleteDocument)


// app
router.get('/api/list/edition', ctrl.authy.accessApp, ctrl.newspaper.indexNewspaper)
router.get('/api/splash', ctrl.newspaper.imagenSplash)
router.post('/api/search/month', ctrl.authy.accessApp, ctrl.newspaper.searchMonth)



/**
* Carga de Pdf e Imgenes
*/
//web
router.post('/uploadFile/:code',ctrl.authy.validateCookieWorpress, ctrl.file.uploadFile);

// ctrl.authy.accessApp,
router.get('/api/downloadFile/:file',  ctrl.file.downloadFile)
router.get('/api/downloadImagen/:filename',  ctrl.file.downloadImagen)



module.exports = router;