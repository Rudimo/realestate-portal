'use strict';

global.DEFAULT_CONFIG_PATH = '.env-test';

/**
 * Core library
 * @type {*|exports|module.exports}
 */
const Core = require('nodejs-lib');

/**
 * Requiring Async operations helper
 *
 * @type {async|exports|module.exports}
 */
const async = require('async');

/**
 * Path core library
 *
 * @type {*|Object|!Object}
 */
const path = require('path');

/**
 * FS core module
 *
 * @type {exports|module.exports}
 */
const fs = require('fs');

/**
 *  Importing Application Facade and run the Application.
 */
let applicationFacade = Core.ApplicationFacade.instance;

// Set application base path
applicationFacade._basePath = path.resolve(__dirname, '..', '..');

// Redefine default application environment
if (process.env.APPLICATION_ENV == null) {
    process.env.ENV_TYPE        = 'dev';
    process.env.APPLICATION_ENV = 'test';
}

function startAppServer(callback) {
    if (global.appServerInitializationRequested == null) {

        global.appServerInitializationRequested = true;

        console.log('Initializing application server');

        applicationFacade.addListener(Core.ApplicationEvent.MONGO_CONNECTED, function (event) {
            callback();
        });

        // Initializing server module
        applicationFacade.load('server', Core.HTTPServer);
        //applicationFacade.load('queue', Core.QueueClient);

        /**
         * Loading applications
         */
        applicationFacade.loadApplications('apps.json');

        // Initializing all modules
        applicationFacade.init();

        /**
         * Running server
         */
        applicationFacade.run();

    } else {
        callback();
    }
}

/*function startQueueServer(callback) {
    if (global.queueServerInitializationRequested == null) {

        global.queueServerInitializationRequested = true;

        console.log('Initializing queue server');

        const spawn = require('child_process').spawn;
        const queue = spawn('node', [/!*'--expose_gc'*!/'--max-old-space-size=256', applicationFacade._basePath + '/queue-server.js']);

        queue.stdout.on('data', (data) => {
            console.log(`queue-server: ${data}`);
        });

        queue.stderr.on('data', (data) => {
            console.log(`queue-server: ${data}`);
        });

        queue.on('close', (code) => {
            console.log(`queue-server exited with code ${code}`);
        });

        process.on('exit', code => {
            console.log('Main process about to exit with code: ' + code + ', terminate queue-server.');
            queue.kill('SIGTERM');
        });

        setTimeout(() => {
            callback();
        }, 3000);

    } else {
        callback();
    }
}*/

function clearDatabase(callback) {

    let userModel         = require('../../app/models/user').model;
    let objectModel         = require('../../app/models/object').model;
    let emailModel          = require('../../app/models/email').model;
    let imageModel          = require('../../app/models/image').model;

    async.parallel([callback => {

        userModel.remove({}, callback);

    }, callback => {

        objectModel.remove({}, callback);

    }, callback => {

        emailModel.remove({}, callback);

    }, callback => {

        imageModel.remove({}, callback);

    }], callback);
}

/*function clearES(callback) {

    Core.ElasticSearch.client.indices.delete({index: Core.ApplicationFacade.instance.config.env.ES_INDEX}, err => {
        if (err) {
            if (err.message.indexOf('no such index') === -1) {
                return callback(err);
            }
        }

        callback();
    });
}*/

/*function clearFiles(callback) {

    try {
        let reportPath = path.resolve(__dirname, '../../public/xml/partner-test-report-dynamic.xml');

        fs.statSync(reportPath);
        fs.unlinkSync(reportPath);
    } catch (err) {

    }


    try {
        let heapUsagePath = path.resolve(__dirname, '../../heap.csv');

        fs.statSync(heapUsagePath);
        fs.unlinkSync(heapUsagePath);
    } catch (err) {

    }

    callback();
}*/

module.exports = {
    startServer: startAppServer,
    //startQueueServer: startQueueServer,
    clearDatabase: clearDatabase,
    //clearES: clearES,
    //clearFiles: clearFiles
};