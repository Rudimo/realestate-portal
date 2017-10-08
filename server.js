'use strict';

/**
 * Long stack traces library
 */
//require('longjohn');

/**
 * Moment library
 *
 * @type {*|exports|module.exports}
 */
const moment = require('moment');

process.on('uncaughtException', err => {

    if (err.message.indexOf('ENFILE') > -1) { // ENFILE: file table overflow
        return console.log(err);
    }

    console.log(err);

    require('fs').appendFileSync(require('path').resolve(__dirname, 'logs/error.log'),
        moment().format('YYYY-MM-DD_HH-mm-ss') + ': ' + ((err && err.stack) ? err.stack : err) + '\r\n\r\n');
    throw err;
});

let Core = require('nodejs-lib');

/**
 *  Importing Application Facade and run the Application and Queue client.
 */
let appFacade = Core.ApplicationFacade.instance;

appFacade.load('server', Core.HTTPServer);
appFacade.load('queue', Core.QueueClient);

/**
 * Loading applications
 */
appFacade.loadApplications('apps.json');

/**
 * Initializing all modules
 */
appFacade.init();

/**
 * Run
 */
appFacade.run();
