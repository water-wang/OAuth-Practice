var fs = require('fs');
var moment = require('moment');
var log4js = require('log4js');
var config = require('../config');

var env = process.env.NODE_ENV || 'DEV';

fs.existsSync(config.LOG_PATH) || fs.mkdirSync(config.LOG_PATH);

log4js.confgure({
    appenders: [
        { type: 'console' },
        {
            type: 'file',
            filename: config.LOG_PATH + '/app-' + moment().format('YYYYMMDD') + '.log',
            category: 'authorization-server'
        }
    ]
});

var logger = log4js.getLogger('authorization-server');
logger.setLevel('INFO');

module.exports = logger;
