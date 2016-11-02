var utils = require('./utils');
var config = require('./config');
var routers = require('./router');

var http = require('http');
var https = require('https');
var app = require('express')();
var uuid = require('node-uuid');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
require('colors');

var logger = utils.logger;

app.use(bodyParser.urlencoded({extended: true, limit: '1mb'}));
app.use(bodyParser.json());
app.use(cookieParser(config.SECRET_SESSION));
app.use(session({
    secret: config.SECRET_SESSION,
    store: new RedisStore({
        port: config.REDIS_PORT,
        host: config.REDIS_HOST
    }),
    resave: true,
    saveUnintialized: true
}));

app.get('/', function (req, res) {
    res.end('UMA Authorization server.');
});

app.use('/', routers);
app.use(function (err, req, res, next) {
   logger.error(err);
   return res.status(500).send('500 Internal error.'); 
});

var options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt'),
    passphrase: config.SSL_PWD
};

https.createServer(options, app).listen(config.PORT, function () {
    console.log('UMA - Authorization server is on.');
});