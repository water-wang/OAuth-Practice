var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = require('express')();
var uuid = require('node-uuid');
var routers = require('./router');

mongoose.connect('mongodb://localhost/book');
var token = uuid.v4();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(function (err, req, res, next) {
    console.log('error');
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});

app.get('/', function (req, res) {
    res.send('Hello from Express.');
});

app.use('/', routers);

app.listen(3000, function () {
    console.log('App active on port 3000');
});