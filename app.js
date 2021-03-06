var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adsRouter = require('./routes/ads');
var mapRouter = require('./routes/map');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/ads', adsRouter);
app.use('/users', usersRouter);
app.use('/map', mapRouter);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

module.exports = app;
