var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = require('express')();
var uuid = require('node-uuid');

mongoose.connect('mongodb://localhost/book');
var token = uuid.v4();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', function (req, res) {
    res.send('Hello from Express.');
});

app.listen(3000, function () {
    console.log('App active on port 3000');
});