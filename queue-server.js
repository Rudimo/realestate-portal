'use strict';

/**
 * Core library
 *
 * @type {*}
 */
const Core = require('nodejs-lib');

/**
 * Winston logger
 *
 * @type {exports|module.exports}
 */
const winston = require('winston');

/**
 * Core path module
 *
 * @type {posix|exports|module.exports}
 */
const path = require('path');

/*
 * Requiring `winston-telegram` will expose
 * `winston.transports.Telegram`
 */
require('winston-telegram').Telegram;

// I can help you with debug async stack, but I can also be a root cause of insufficient RAM ;-)
//require('longjohn');

/**
 * Moment library
 *
 * @type {*|exports|module.exports}
 */
const moment = require('moment');

process.on('uncaughtException', err => {

    console.log(err);

    if (err.message.indexOf('ENFILE') > -1) { // ENFILE: file table overflow
        return;
    }

    require('fs').appendFileSync(require('path').resolve(__dirname, 'logs/error.log'),
        moment().format('YYYY-MM-DD_HH-mm-ss') + ': ' + ((err && err.stack) ? err.stack : err) + '\r\n\r\n');
    throw err;
});

/**
 *  Importing Application Facade and run the Queue server.
 */
var appFacade = Core.ApplicationFacade.instance;

if (appFacade.config.env.CONSOLE_LOGGER_ENABLED == 'yes') {
    console.log('CONSOLE_LOGGER_ENABLED');
    appFacade.logger.logger.add(winston.transports.Console, {
        level: 'debug',
        timestamp: true,
        humanReadableUnhandledException: true
    });
}

let logFilePath = path.join(__dirname, 'logs/logfile.log');

console.log('logFilePath = ' + logFilePath);

appFacade.logger.logger.add(winston.transports.File, {
    level: 'debug',
    maxsize: 1024 * 1024 * 100, // 100 MB
    maxFiles: 20,
    json: false,
    timestamp: true,
    filename: logFilePath
});

if (appFacade.config.env.TELEGRAM_LOGGER_BOT_ENABLED == 'yes') {
    appFacade.logger.logger.add(winston.transports.Telegram, {
        level: 'warning',
        token: appFacade.config.env.TELEGRAM_LOGGER_BOT_TOKEN,
        chatId: appFacade.config.env.TELEGRAM_LOGGER_BOT_CHAT_ID
    });
}

appFacade.load('queue', Core.QueueServer);

appFacade.on(Core.ApplicationEvent.MONGO_CONNECTED, event => {

    // Loading models
    appFacade.loadModels(__dirname + '/app/models');

    appFacade.logger.info('#### Mongo connection Initialized');

    appFacade.logger.error('[not error] Queue started');
});

/**
 * Initializing all modules
 */
appFacade.init();

/**
 * Set events for worker jobs
 */
appFacade.queue.setWorkersDir('./app/workers');

/**
 * Run
 */
appFacade.run();