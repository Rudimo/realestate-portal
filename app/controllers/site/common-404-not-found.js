'use strict';

/**
 * Core library
 */
const Core = require('nodejs-lib');

/**
 * Require Base Site Controller
 *
 * @type {BaseController|exports|module.exports}
 */
const BaseSiteController = require('./base.js');

/**
 * CommonNotFoundError not found error
 *
 * @type {CommonNotFoundError}
 */
const CommonNotFoundError = require('../../errors/common-not-found');

/**
 * Error404NotFound controller
 *
 */
class Error404NotFound extends BaseSiteController {

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
    }

    /**
     * Load controller
     *
     * @param callback
     */
    load(callback) {
        super.load(err => {
            if (err) return callback(err);

            callback(new CommonNotFoundError());
        });
    }
}

/**
 * Exporting Controller
 *
 * @type {Function}
 */
module.exports = (request, response, next) => {
    let controller = new Error404NotFound(request, response, next);
    controller.run();
};