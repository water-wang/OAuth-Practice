var util = require('util');

function OAuthError(code, message, err) {
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);

    if (err instanceof Error) {
        this.stack = err.stack;
        this.message = message || err.message;
    } else {
        this.message = message || '';
    }
    this.code = code;

    switch (code) {
        case 'unsupported_grant_type':
            this.status = 400;
            break;
        case 'invalid_grant':
            this.status = 400;
            break;
        case 'invalid_request':
            this.status = 400;
            break;
        case 'invalid_client':
            this.status = 401;
            break;
        case 'invalid_token':
            this.status = 401;
            break;
        case 'server_error':
            this.status = 500;
            break;
        default:
            this.status = 500;
            break;
    }

    return this;
}

util.inherits(OAuthError, Error);

module.exports = OAuthError;