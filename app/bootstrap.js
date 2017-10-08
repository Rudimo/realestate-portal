'use strict';

/**
 * Requiring Core Library
 *
 * WARNING: Core modules MUST be included from TOP Level Module.
 * All dependencies for core module must be excluded from the package.json
 */
const Core = process.mainModule.require('nodejs-lib');

/**
 * Requiring main Path module
 *
 * @type {*}
 */
const path = require('path');

/**
 * Winston logger
 *
 * @type {exports|module.exports}
 */
const winston = require('winston');

/**
 * Core fs module
 *
 * @type {exports|module.exports}
 */
const fs = require('fs');

/**
 * ExpressJS module
 */
const express = require('express');

/**
 * Application constants
 * @type {*|exports|module.exports}
 */
const c = require('./constants');

/**
 * SWIG view filters
 */
const viewFilters = require('./libs/view-filters');

/**
 * Moment library
 *
 * @type {*|exports|module.exports}
 */
const moment = require('moment');
moment.locale('ru');

/*
 * Requiring `winston-telegram` will expose
 * `winston.transports.Telegram`
 */
require('winston-telegram').Telegram;

/**
 * Morgan logger
 *
 * @type {morgan|exports|module.exports}
 */
const morgan = require('morgan');

/**
 * Loader class for the model
 */
class Loader extends Core.AppBootstrap {
    /**
     * Model loader constructor
     */
    constructor() {
        // We must call super() in child class to have access to 'this' in a constructor
        super();

        /**
         * Module name/version
         *
         * @type {null}
         * @private
         */
        this._moduleName = JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf8')).name;

        this._moduleVersion = JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf8')).version;

        Core.ApplicationFacade.instance.config._configuration.appVersion = this._moduleVersion;
    }

    /**
     * Pre-Initializing module configuration
     */
    preInit() {
        let basePath = path.dirname(__dirname);

        /**
         * Register middleware before ANY STATIC Resource handled. In this case middleware will be applied each time any resource (css, image, static html etc) loaded from the server.
         */
        this.applicationFacade.addListener(Core.HTTPServer.HTTPServerEvents.BEFORE_REGISTER_PASSPORT, function (event) {
            //// Init application Passport
            //var userModel = require('./models/user.js');
            //this.applicationFacade.server.initPassport(userModel);
        });

        //if (Core.ApplicationFacade.instance.config.isDev) {
            // I can help you with debug async stack, but I can also be a root cause of insufficient RAM ;-)
            //require('longjohn');
        //}

        /*this.applicationFacade.server.application.use(morgan('tiny', {
            stream: {
                write: message => {
                    this.applicationFacade.logger.info(message);
                }
            }
        }));*/

        this.applicationFacade.server.application.disable('x-powered-by'); // Disable 'x-powered-by:Express'

        this.applicationFacade.server.application.use(express.static('public-dynamic'));
    }

    /**
     * Initializing module configuration
     */
    init() {
        super.init();

        if (Core.ApplicationFacade.instance.config.env.CONSOLE_LOGGER_ENABLED == 'yes') {
            console.log('CONSOLE_LOGGER_ENABLED');
            this.applicationFacade.logger.logger.add(winston.transports.Console, {
                level: 'debug',
                timestamp: true,
                humanReadableUnhandledException: true
            });
        }

        let basePath = path.dirname(__dirname);

        console.log('Log to file basePath = ' + basePath);

        this.applicationFacade.logger.logger.add(winston.transports.File, {
            level: 'debug',
            maxsize: 1024 * 1024 * 100, // 100 MB
            maxFiles: 20,
            json: false,
            timestamp: true,
            filename: basePath + '/logs/logfile.log'
        });

        if (Core.ApplicationFacade.instance.config.env.TELEGRAM_LOGGER_BOT_ENABLED == 'yes') {
            this.applicationFacade.logger.logger.add(winston.transports.Telegram, {
                level: 'error',
                token: Core.ApplicationFacade.instance.config.env.TELEGRAM_LOGGER_BOT_TOKEN,
                chatId: Core.ApplicationFacade.instance.config.env.TELEGRAM_LOGGER_BOT_CHAT_ID
            });
        }

        // Loading module routes
        this.applicationFacade.server.loadRoutes('/app/routes', basePath);

        // Loading models
        this.applicationFacade.loadModels(basePath + '/app/models');
    }

    /**
     * Bootstrapping module
     *
     * MongoDB is available on this stage
     */
    bootstrap() {
        super.bootstrap();

        /**
         * Requiring NodeJS Admin
         * @type {Loader|exports|module.exports}
         */
        let NodeJSAdmin = require('nodejs-admin');

        this.applicationFacade.logger.debug('#### Initializing ACL for application');
        this.applicationFacade.server.initAcl(NodeJSAdmin.Admin.Models.ACLPermissions);
        let configurationModel = NodeJSAdmin.Admin.Models.Configuration;
        configurationModel.readConf(function (config) {
            Core.ApplicationFacade.instance.config.mergeConfig(config);
        });

        this.applicationFacade.registry.load('Admin.Models.Navigation').addItem({
            name: 'Объявления',
            url: '/admin/objects',
            icon: 'fa-bullhorn',
            order: 1
        });

        this.applicationFacade.registry.load('Admin.Models.Navigation').addItem({
            name: 'Импорт фидов',
            url: '/admin/import_feeds',
            icon: 'fa-bullhorn',
            order: 2
        });

        for (let filter in viewFilters) {

            if (viewFilters.hasOwnProperty(filter)) {

                Core.View.setFilter(filter, viewFilters[filter]);
            }
        }

        // Set 404 route
        this.applicationFacade.server.application.use((req, res, next) => {

            req.route = {
                path: 'dummy-404-route'
            };

            require('./controllers/site/common-404-not-found')(req, res, next);
        });

        // Set 500 common route
        this.applicationFacade.server.application.use((err, req, res, next) => {

            this.applicationFacade.logger.error(err);

            req.route = {
                path: 'dummy-500-route'
            };

            require('./controllers/site/common-500-internal-error')(req, res, next);
        });
    }

    /**
     * Run module based on configuration settings
     */
    run() {
        super.run();

        // Init application Passport

        let userModel = require('./models/user.js');
        this.applicationFacade.server.initPassport(userModel);

        this.navigation = this.applicationFacade.registry.load('Admin.Models.Navigation');

        if (process.env.IS_MASTER === 'yes') { // For master node only

            if (!Core.ApplicationFacade.instance.config.isDev) { // do not run scheduler for Dev environment
                require('./scheduler');
            }

            this.applicationFacade.registry.load('Admin.Models.Job').scheduleJobs();
        }

        this.applicationFacade.logger.error('[not error] Node started');
    }
}

/**
 * Exporting module classes and methods
 */
module.exports = Loader;
