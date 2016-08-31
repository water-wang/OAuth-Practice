var express = require('express');
var request = require('request');
var uuid = require('node-uuid');
var querystring = require('querystring');
var router = express.Router();

var SERVER_URL = 'http://localhost:3000';
var REDIRECT_SERVER_URL = 'http://localhost:5000';

var CLIENT_ID = '46eaaa25-3f17-4ffd-9433-c3190ea1de58';

router.get('/url', function (req, res) {
    var state = uuid.v4();
    req.session.state = state;

    var url = SERVER_URL + '/authorize';
    var params = {
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_SERVER_URL + '/callback',
        state: state,
        scope: 'openid',
        response_type: 'code',
        user_id: 1
    };

    res.end(url + '?' + querystring.stringify(params));
});

router.get('/callback', function (req, res, next) {
    var state = req.query.state;
    var code = req.query.code;

    // Compare the state with the session's state
    if (state !== req.session.state) {
        return next(new Error('State does not match'));
    }

    request.post({
        url: SERVER_URL + '/token',
        form: {
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: REDIRECT_SERVER_URL + '/callback',
            client_id: CLIENT_ID
        }
    }, function (err, res, body) {
        if (err) {
            return next(err);
        }

        var resp = JSON.parse(body);
        var accessToken = resp.access_token;

        if (accessToken) {
            // Use the Access Token for a protected resource request
            request.get({
                url: SERVER_URL + '/userinfo',
                data: {
                    access_token: accessToken
                }
            }, function (err, res, body) {
                if (err) {
                    return;
                }
                var name = res.user;
            });
        }

    });
});

module.exports = router;