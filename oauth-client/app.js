var session = require('express-session');
var app = require('express')();
var routers = require('./router');

app.set('view engine', 'html');
app.engine('html', require('ejs-mate'));

app.use(session({
    secret: 'sessionsecret',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));

app.get('/', function (req, res) {
    res.render(__dirname + '/index.html');
});

app.use('/', routers);

app.listen(5000, function () {
    console.log('Client active on port 5000.');
});
