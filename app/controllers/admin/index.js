'use strict';

/**
 * Core library
 */
const Core = require('nodejs-lib');

/**
 * Require Base Front Controller
 *
 * @type {AdminCRUDController|exports|module.exports}
 */
let AdminCRUDController = require('./base_crud');

const path = require('path');
const async             = require('async');
const moment            = require('moment');
const userModel         = require('../../models/user');
const objectModel       = require('../../models/object');
const c                 = require('../../constants');

/**
 *  Index controller
 */
class Index extends AdminCRUDController {

    /**
     * Controller constructor
     */
    constructor(request, response, next) {
        // We must call super() in child class to have access to 'this' in a constructor
        super(request, response, next);

        /**
         * Context of the controller
         *
         * @type {string}
         * @private
         */
        this._baseUrl = '/admin';
    }

    /**
     * Load view file
     *
     * @param dataReadyCallback
     */
    load(dataReadyCallback) {

        // this.view(Core.View.htmlView('app/views/admin/index.swig'));
        this.view(Core.ModuleView.htmlView(path.resolve(__dirname, '..', '..', 'views', 'admin', 'index.swig')));
        // Send DATA_READY event
        dataReadyCallback();
    }

}

/**
 * Exporting Controller
 *
 * @type {Function}
 */
module.exports = (request, response) => {
    let controller = new Index(request, response);
    controller.run();
};