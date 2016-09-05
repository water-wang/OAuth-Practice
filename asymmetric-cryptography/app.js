var fs = require('fs');
var ursa = require('ursa');
var path = require('path');
var mkdirp = require('mkdirp');

var rootPath = './keys';
makeKeys(rootPath, 'sender');
makeKeys(rootPath, 'receiver');

var senderPrivKey = ursa.createPrivateKey(fs.readFileSync(path.join(rootPath, 'sender', 'private.pem')));
var senderPubkey = ursa.createPublicKey(fs.readFileSync(path.join(rootPath, 'sender', 'public.pem')));

var recipientPrivKey = ursa.createPrivateKey(fs.readFileSync(path.join(rootPath, 'receiver', 'private.pem')));
var recipientPubKey = ursa.createPublicKey(fs.readFileSync(path.join(rootPath, 'receiver', 'public.perm')));

var msg = {
    'user': 'Nikola Tesla',
    'address': 'W 40th St, New York, NY 10018',
    'state': 'active'
};
msg = JSON.stringify(msg);

// encrypt with recipient public key, and sign with sender private key
var encrypted = recipientPubKey.encrypt(msg, 'utf8', 'base64');
var signed = senderPrivKey.hashAndSign('sha256', encrypted, 'utf8', 'base64');

var bufferedMsg = new Buffer(encrypted);
if (!senderPubkey.hashAndVerify('sha256', bufferedMsg, signed, 'base64')) {
    throw new Error('invalid signature');
} else {
    var decryptedMsg = recipientPrivKey.decrypt(encrypted, 'base64', 'utf8');
    console.log('decrypted message verified:', decryptedMsg);
}

function makeKeys(rootPath, subPath) {
    try {
        mkdirp.sync(path.join(rootPath, subPath));
    } catch (err) {
        console.error(err);
    }

    var key = ursa.generatePrivateKey(1024, 65537);;
    var privatePem = key.toPrivatePem();
    var publicPem = key.toPublicPem();

    try {
        fs.writeFileSync(path.join(rootPath, subPath, 'private.pem'), privatePem, 'ascii');
        fs.writeFileSync(path.join(rootPath, subPath, 'public.pem'), publicPem, 'ascii');
    } catch (err) {
        console.error(err);
    }
}