var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var Client = require('./lib/models/client');
var AuthCode = require('./lib/models/authcode');
var Token = require('./lib/models/token');
var IdToken = require('./lib/models/idtoken');
var RefreshToekn = require('./lib/models/refreshtoken');
var authorize = require('./lib/middleware/authorize');
var OAuthError = require('./lib/errors/oautherror');
var errorHandler = require('./lib/errors/handler');

router.get('/register', function (req, res, next) {
    var client = new Client({
        name: 'Client',
        userId: 1,
        redirectUri: 'http://localhost:5000/callback'
    });
    client.save(function (err) {
        if (err) {
            next(new Error('Client name exists already.'));
        } else {
            res.json(client);
        }
    });
});


router.get('/authorize', function (req, res, next) {
    var responseType = req.query.response_type;
    var clientId = req.query.client_id;
    var redirectUri = req.query.redirect_uri;
    var scope = req.query.scope;
    var state = req.query.state;
    var userId = req.query.user_id;

    if (!responseType) {
        // cancel the request - we miss the response type
        return next(new OAuthError('invalid_request', 'Missing parameter: response_type.'));
    }

    if (responseType !== 'code') {
        // notify the user about an unsupported response type
    }

    if (!clientId) {
        // cancel the request - client id is missing
    }

    if (!scope || scope.indexOf('openid') < 0) {
        return next(new OAuthError('invalid_scope', 'Scope is missing or not well-defined.'));
    }

    Client.findOne({
        clientId: clientId
    }, function (err, client) {
        if (err) {
            // handle the error by passing it to the middleware 
            next(err);
        }

        if (!client) {
            // cancel the request - the client does not exist
        }

        if (redirectUri !== client.redirectUri) {
            // cancel the request 
        }

        if (scope !== client.scope) {
            // handle the scope
            return next(new OAuthError('invalid_scope', 'Scope is missing or not well-defined.'));
        }

        var authCode = new AuthCode({
            clientId: clientId,
            userId: client.userId,
            redirectUri: redirectUri
        });
        authCode.save();

        var response = {
            state: state,
            code: authCode.code
        };

        if (redirectUri) {
            var redirect = redirectUri + '?code=' + response.code + (state === undefined ? '' : '&state=' + state);
            res.redirect(redirect);
        } else {
            res.json(response);
        }
    });
});


router.post('/token', function (req, res) {
    var grantType = req.body.grant_type;
    var refreshToken = req.body.refresh_token;
    var authCode = req.body.code;
    var redirectUri = req.body.redirect_uri;
    var clientId = req.body.client_id;

    if (!grantType) {
        // no grant type passed - cancel this request
        return errorHandler(new OAuthError('invalid_request', 'Missing paramter: grant_type'), res);
    }

    if (grantType === 'authorization_code') {
        AuthCode.findOne({
            code: authCode
        }, function (err, code) {
            if (err) {
                // handle the error
            }

            if (!code) {
                // no valid authorization code provided - cancel
            }

            if (code.consumed) {
                // the code got consumed already - cancel
                return errorHandler(new OAuthError('invalid_grant', 'Authorization Code expired'), res);
            }

            code.consumed = true;
            code.save();

            if (code.redirectUri !== redirectUri) {
                // cancel the request
            }

            Client.findOne({
                clientId: clientId
            }, function (err, client) {
                if (err) {
                    // the client id provided was a mismatch or does not exist
                }

                if (!client) {
                    // the client id provided was a mismatch or does not exist
                }

                var _refreshToken = new RefreshToekn({
                    userId: code.userId
                });
                _refreshToken.save();

                var _token, response;
                if (client.scope && client.scope.indexOf('openid') >= 0) {
                    var _idToken = new IdToken({
                        iss: client.redirectUri,
                        aud: client.clientId,
                        userId: code.userId
                    });
                    _idToken.save();

                    _token = new Token({
                        refreshToken: _refreshToken.token,
                        idToken: _idToken.sub,
                        userId: code.userId
                    });
                    _token.save();

                    response = {
                        access_token: _token.accessToken,
                        refresh_token: _token.refreshToken,
                        id_token: _idToken.sub,
                        expires_in: _token.expiresIn,
                        token_type: _token.tokenType
                    };
                } else {
                    _token = new Token({
                        refreshToken: _refreshToken.token,
                        userId: code.userId
                    });
                    _token.save();

                    response = {
                        access_token: _token.access_token,
                        refresh_token: _token.refreshToken,
                        expires_in: _token.expiresIn,
                        token_type: _token.tokenType
                    };
                }

                res.json(response);
            });
        });
    } else if (grantType === 'refresh_token') {
        if (!refreshToken) {

        }
        RefreshToekn.findOne({
            token: refreshToken
        }, function (err, token) {
            if (err) {

            }

            if (!token) {

            }

            if (token.consumed) {

            }

            RefreshToekn.update({
                userId: token.userId,
                consumed: false
            }, {
                    $set: { consumed: true }
                });

            var _refreshToken = new RefreshToekn({
                userId: token.userId
            });
            _refreshToken.save();

            var _token = new Token({
                refreshToken: _refreshToken.token,
                userId: token.userId
            });
            _token.save();

            var response = {
                access_token: _token.access_token,
                refresh_token: _token.refresh_token,
                expires_in: _token.expiresIn,
                token_type: _token.tokenType
            };

            res.json(response);
        })
    }
});

router.get('/userinfo', authorize, function (req, res) {
    var user = {
        name: 'Tim Messerchmidt',
        country: 'Germany'
    }

    res.json(user);
});

module.exports = router;