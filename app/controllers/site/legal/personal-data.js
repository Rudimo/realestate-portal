'use strict';

/**
 * Core library
 */
const Core = require('nodejs-lib');

/**
 * Require Base Application Controller
 *
 * @type {BaseApplicationController|exports|module.exports}
 */
const BaseApplicationController = require('../base.js');

/**
 * PersonalData controller
 */
class PersonalDataController extends BaseApplicationController {

    /**
     * Load view file
     *
     * @param callback
     */
    load(callback) {
        super.load(err => {
            if (err) return callback(err);

            /**
             * Set output view object
             */
            this.view(Core.View.htmlView('app/views/site/legal/personal-data.swig'));

            callback();
        });
    }
}

/**
 * Exporting Controller
 *
 * @type {Function}
 */
module.exports = (request, response, next) => {
    let controller = new PersonalDataController(request, response, next);
    controller.run();
};