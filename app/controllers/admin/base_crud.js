'use strict';

/**
 * Core library
 *
 * @type {*}
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
const constants = require('../../constants');

/**
 * Requiring Base CRUD Controller
 *
 * @type {AdminBaseCRUDController|exports|module.exports}
 */
const AdminBaseCRUDController = require('nodejs-admin').Admin.Controllers.BaseCRUD;

/**
 * GeoIP library
 *
 * @type {*|exports|module.exports}
 */
const geoTools = require('geotools');

/**
 * Base application controller
 */
class AdminCRUDController extends AdminBaseCRUDController {
    /**
     * Controller constructor
     */
    constructor(request, response, next) {
        // We must call super() in child class to have access to 'this' in a constructor
        super(request, response, next);

        /**
         * Init application constants
         *
         * @type {*|exports|module.exports}
         */
        this.data.c = constants;

        /**
         * Path to UI templates
         *
         * @type {string}
         * @private
         */
        this._baseViewsDir = path.join(__dirname, '../..', 'views', 'admin');

        /**
         * Template string for counter visualization
         *
         * @type {string}
         */
        this.counterStringTemplate = 'Показано %startItem% - %listCount% из %totalItems%';

        /**
         * Client geo info
         *
         * @type {null}
         */
        this.data.geoInfo = geoTools.lookup(this.ipAddress) || {utcOffset: '+03:00'};
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
}

/**
 * Exporting Controller
 *
 * @type {Function}
 */
module.exports = AdminCRUDController;