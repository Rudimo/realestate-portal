'use strict';

/**
 * Core library
 */
const Core = require('nodejs-lib');

/**
 * Application config
 */
const Config = Core.ApplicationFacade.instance.config;

/**
 * Require Base Site Controller
 *
 * @type {BaseController|exports|module.exports}
 */
const BaseSiteController = require('./base.js');

/**
 *  GeoCoder controller
 */
class GeoCoderController extends BaseSiteController {

    /**
     * Controller constructor
     */
    constructor(request, response, next) {
        // We must call super() in child class to have access to 'this' in a constructor
        super(request, response, next);

        /**
         * Is this controller should handle subdomains? Yes
         *
         * @type {boolean}
         * @private
         */
        this._subDomainAllowedForController = true;

        /**
         * Address model
         *
         * @type {AddressesModel|Function|exports|module.exports}
         */
        this.addressModel = require('../../models/address');
    }

    /**
     * Init data
     *
     * @param callback
     */
    load(callback) {

        this.terminate();

        if (!this.request.query || !this.request.query.q) {
            this.response.send([]);
            return callback();
        }

        if (this.request.query.full) {
            this.addressModel.resolveOneAddress(this.request.query.q, (err, addresses) => {
                if (err) {
                    this.response.send({});
                    this.logger.info(err);
                    return callback();
                }

                this.response.send(addresses);
                callback();
            });
        } else {
            this.addressModel.resolveAddress(this.request.query, (err, addresses) => {
                if (err) {
                    this.response.send([]);
                    this.logger.info(err);
                    return callback();
                }

                this.response.send(addresses);
                callback();
            });
        }
    }
}

/**
 * Exporting Controller
 *
 * @type {Function}
 */
module.exports = (request, response, next) => {
    let controller = new GeoCoderController(request, response, next);
    controller.run();
};