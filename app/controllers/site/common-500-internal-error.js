'use strict';

const BaseCiteController  = require('./base.js');
const InternalServerError = require('../../errors/internal-server-error');

class InternalServerErrorController extends BaseCiteController {

    constructor(request, response, next) {
        // We must call super() in child class to have access to 'this' in a constructor
        super(request, response, next);

        /**
         * Is this controller should handle sub domains? Yes
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

            callback(new InternalServerError());
        });
    }
}

/**
 * Exporting Controller
 *
 * @type {Function}
 */
module.exports = (request, response, next) => {
    let controller = new InternalServerErrorController(request, response, next);
    controller.run();
};