var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');


/** OpenID Connect Discovery endpoints */
router.get('/.well-known/webfinger', function (req, res) {
    
});

router.get('/.well-known/uma-configuration', function (req, res) {
    
});


/** OpenID Connect Dynamic register endpoints */
router.get('/connet/register', function (req, res) {
    
});

router.post('/connect/register', function (req, res) {
    
});


/** OAuth endpoints */
router.get('/authorize', function (req, res) {
    
});

router.post('/token', function (req, res) {
    // JSON Web Token Profile
});


/** Token Introspection Profile endpoints */
router.post('/introspection', function (req, res) {
    
});


/** Token Revocation endpoints */
router.post('/revoke', function (req, res) {
    
});


/** Resource Set Registration  endpoints*/
router.get('/resource_set', function (req, res) {
    
});

router.post('/resource_set', function (req, res) {
    
});

router.get('/resource_set/:_id', function (req, res) {
    
});

router.put('/resource_set/:_id', function (req, res) {
    
});

router.delete('/resource_set/:_id', function (req, res) {
    
});


/** OpenID Connect endpoints */
router.get('/userinfo', function (req, res) {
    
});


module.exports = router;