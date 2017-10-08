'use strict';

/**
 * Core library
 */
const Core = require('nodejs-lib');

/**
 * Require Base Front Controller
 *
 * @type {BaseController|exports|module.exports}
 */
const BaseController = require('./base.js');

/**
 *  Signin controller
 */
class Logout extends BaseController {

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
     * Load view file
     *
     * @param dataReadyCallback
     */
    load (dataReadyCallback) {
        this.request.logout();
        this.terminate();
        this.response.redirect('/');
        dataReadyCallback();
    }
}

/**
 * Exporting Controller
 *
 * @type {Function}
 */
exports = module.exports = function(request, response, next) {
    let controller = new Logout(request, response, next);
    controller.run();
};
