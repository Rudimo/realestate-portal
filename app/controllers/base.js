'use strict';

/**
 * Core library
 */
const Core = require('nodejs-lib');

/**
 * Path core library
 *
 * @type {*|Object|!Object}
 */
const path = require('path');

/**
 * Application constants
 *
 * @type {*|exports|module.exports}
 */
const constants = require('../constants');

/**
 * Application mailer
 *
 * @type {Mailer|exports|module.exports}
 */
const mailer = require('../libs/mailer');

/**
 * Lodash library
 */
const _ = require('lodash');

/**
 * RequestJS
 *
 * @type {request}
 */
const request = require('request');

/**
 * GeoIP library
 *
 * @type {*|exports|module.exports}
 */
const geoTools = require('geotools');

/**
 * All cities
 *
 * @type {Array}
 */
const cities = require('../data/cities');

/**
 * Library for generating a slug
 *
 * @type {*|exports|module.exports}
 */
const speakingUrl = require('speakingurl');

/**
 * Object model
 *
 * @type {Function}
 */
const objectModel = require('../models/object');

/**
 * All regions
 *
 * @type {Array}
 */
const regions = require('../data/region');

/**
 * MomentJS library
 */
const moment = require('moment');

/**
 * InternalServerError error
 *
 * @type {InternalServerError}
 */
const InternalServerError = require('../errors/internal-server-error');

/**
 * Base application controller
 */
class BaseController extends Core.Controller {
    /**
     * Controller constructor
     */
    constructor(request, response, next) {
        // We must call super() in child class to have access to 'this' in a constructor
        super(request, response, next);

        /**
         * Path to UI templates
         *
         * @type {string}
         * @private
         */
        this._baseViewsDir = path.join(__dirname, '..', 'views');

        /**
         * Init application constants
         *
         * @type {*|exports|module.exports}
         */
        this.data.c = constants;

        /**
         * Application mailer
         *
         * @type {Mailer|exports|module.exports}
         * @private
         */
        this._mailer = mailer;
    }

    /**
     * Application mailer getter
     *
     * @returns {Mailer|exports|module.exports}
     */
    get mailer() {
        return this._mailer;
    }

    /**
     * Application logger getter
     *
     * @returns {Logger|exports|module.exports}
     */
    get logger() {
        return Core.ApplicationFacade.instance.logger;
    }

    /**
     * Get client IP address
     *
     * @returns {*}
     */
    get ipAddress() {

        //return '93.120.167.236';
        return this.request.headers['cf-connecting-ip'] || this.request.connection.remoteAddress;
    }

    /**
     * Controller pre load
     */
    preInit(callback) {
        super.preLoad(err => {
            if (err) return callback(err);

            this.data.ipAddress = this.ipAddress;

            this.data.geoInfo = geoTools.lookup(this.ipAddress);

            if (!this.data.geoInfo) {

                this.logger.info(`BaseController::init: failed IP lookup for "${this.ipAddress}"`);

                this.data.geoInfo = {utcOffset: '+03:00', city: 'Москва'};
            }

            this.data.geoInfo.cityNameUrl = speakingUrl(this.data.geoInfo.city, {lang: 'ru', separator: '-'});

            let city = _.find(cities, {name: this.data.geoInfo.city});

            if (city) {

                this.data.geoInfo.cityName2 = city.name3;
            }

            let region = _.find(regions, {name: this.data.geoInfo.regionName});

            if (!region) {

                region = _.find(regions, {name: 'Москва'});
            }

            this.data.geoInfo.region = region;

            this.data.googleRecapchaSiteKey = Core.ApplicationFacade.instance.config.env.GOOGLE_RECAPCHA_SITE_KEY;

            this.data.httpProtocol = Core.ApplicationFacade.instance.config.env.HTTP_PROTOCOL;
            this.data.httpDomain   = Core.ApplicationFacade.instance.config.env.HTTP_DOMAIN;

            callback();
        });
    }

    /**
     * On create/update failed
     *
     * @param err
     * @param callback
     */
    onCreateOrUpdateFailed(err, callback) {
        this.terminate();

        let errors = [];

        if (err instanceof objectModel.mongoose.Error.ValidationError) {

            _.each(err.errors, item => {
                errors.push(item.message);
            });

            this.response.send({result: 'ERR', errors: errors});

            callback();

        } else if (err instanceof Core.ValidationError) {

            errors.push(err.message);

            this.response.send({result: 'ERR', errors: errors});

            callback();

        } else {

            this.logger.error(err);

            callback(err);
        }
    };

    /**
     * Render error
     */
    renderError(error) {

        if (!error.shouldBeHandled) {

            this.logger.error(error);

            // override error to show to user
            error = new InternalServerError();
        }

        this.data.moment = moment;

        let view = Core.View.htmlView(error.viewPath, this.data);

        view.render(this.response, this.request, {statusCode: error.code});
    }

    /**
     * Validate recapcha
     *
     * @param code
     * @param callback
     */
    validateRecapcha(code, callback) {

        if (Core.ApplicationFacade.instance.config.isDev) {

            return callback(null, true);
        }

        console.log(code);

        request.post({
            url: 'https://www.google.com/recaptcha/api/siteverify',
            form: {
                secret: Core.ApplicationFacade.instance.config.env.GOOGLE_RECAPCHA_SECRET,
                response: code,
                remoteip: this.ipAddress
            },
            json: true
        }, (err, httpResponse, body) => {
            if (err) return callback(err);

            callback(null, body.success);
        });
    }

    /**
     * Obtain breadcrumb url
     *
     * @param options
     * @returns {string}
     */
    obtainBreadcrumbUrl(options) {

        let url = `${this.data.meta.protocol}://`;

        if (options.subDomain) {
            url += `${options.subDomain}.`;
        }

        url += `${this.data.meta.domain}${options.path}`;

        return url;
    }
}

/**
 * Exporting Controller
 *
 * @type {Function}
 */
module.exports = BaseController;
