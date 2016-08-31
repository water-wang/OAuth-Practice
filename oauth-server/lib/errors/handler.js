function handleError(err, res) {
    res.set('Cache-Control', 'no-store');
    res.set('Pragma', 'no-cache');

    if (err.code === 'invalid_client') {
        var header = 'Bearer realm="book", error ="invalida_token", error_description="No access token provided"';
        res.set('WWW-Authenticate', header);
    }
    res.status(err.status).send({
        error: err.code,
        desciption: err.message
    });
}

module.exports = handleError;