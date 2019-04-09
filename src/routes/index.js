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

//web
router.get('/subscription/index',  ctrl.customer.indexSubscription);

/*Authy manejo de session*/
router.post('/api/customer/login', ctrl.authy.loginApp);

/*CRUD Plan */
router.get('/api/plan/index', ctrl.plan.indexPlan);

/* Get Feed transform Xml a Json */
router.get('/api/feed',ctrl.authy.accessApp ,ctrl.external.feedZeta);

/*Get de clima de openweathermap */
router.get('/api/widget',ctrl.authy.accessApp, ctrl.external.weatherZeta);
router.get('/api/money', ctrl.authy.accessApp,ctrl.external.moneyZeta);
router.get('/api/multimedia',ctrl.authy.accessApp, ctrl.external.listVideo);
// router.post('/api/loginWorpress', ctrl.external.loginWordpress);

/*Escucha de eventtos de conekta*/
router.post('/api/notification/conekta', ctrl.external.hooksPaid);

/**
* Crud de edicciones
*/
// web
router.post('/create/edition', ctrl.newspaper.createNewspaper);
router.get('/list/edition',  ctrl.newspaper.indexAll);
router.get('/remove/edition/:code',  ctrl.newspaper.deleteNewspaper);
router.get('/remove/front/:code', ctrl.newspaper.deleteFront)
router.get('/remove/document/:code', ctrl.newspaper.deleteDocument)


// app
router.get('/api/list/edition', ctrl.authy.accessApp, ctrl.newspaper.indexNewspaper)
router.get('/api/splash', ctrl.newspaper.imagenSplash)
router.post('/api/search/month', ctrl.authy.accessApp, ctrl.newspaper.searchMonth)



/**
* Carga de Pdf e Imgenes
*/
//web
router.post('/uploadFile/:code',ctrl.file.uploadFile);

// ctrl.authy.accessApp,
router.get('/api/downloadFile/:file',  ctrl.file.downloadFile)
router.get('/api/downloadImagen/:filename',  ctrl.file.downloadImagen)



module.exports = router;