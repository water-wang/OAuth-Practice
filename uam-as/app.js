var app = require('express')();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var uuid = require('node-uuid');
var http = require('http');
var https = require('https');
var routers = require('./routers');


routers.get('/', function (req, res) {
    res.end('UMA Authorization server.');
});

app.use('/', routers);
app.use(function (err, req, res, next) {
    
});

app.listen = function () {
    console.log('UMA - Authorization server is on.');
    var server = https.createServer(this);
    return server.listen.apply(server, arguments);
};

app.listen(8090);