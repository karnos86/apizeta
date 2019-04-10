var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv').config({})
var fileUpload = require('express-fileupload')
var cors = require('cors')
require('events').EventEmitter.defaultMaxListeners = 25;

var indexRouter = require('./src/routes/index');

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({ extended: false,  limit: '10mb'}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 },
  tempFileDir :path.join(__dirname, 'temp'), 
  // preserveExtension: true,
  abortOnLimit:true,
}))

app.use('/', indexRouter);


module.exports = app;
