'use strict';

/**
 * Core library
 */
const Core = require('nodejs-lib');

/**
 * Requiring base Controller
 *
 * @type {AdminCRUDController}
 */
const AdminCRUDController = require('./base_crud');

/**
 * Application constants
 *
 * @type {*|exports|module.exports}
 */
const c = require('../../constants');

/**
 *  AdminFeed controller
 */
class AdminImportFeed extends AdminCRUDController {

    /**
     * Controller constructor
     */
    constructor(request, response, next) {
        // We must call super() in child class to have access to 'this' in a constructor
        super(request, response, next);

        /**
         * Current CRUD model instance
         *
         * @type {Object}
         * @private
         */
        this._model = require('../../models/import_feed.js');

        /**
         * Context of the controller
         *
         * @type {string}
         * @private
         */
        this._baseUrl = '/admin/import_feeds';

        /**
         * Path to controller views
         *
         * @type {string}
         * @private
         */
        this._viewsPath = 'import_feed';

        /**
         * Mongoose default fields. Used in getItemFromRequest().
         *
         * @type {Array}
         * @private
         */
        this._modelEditableFields = ['url', 'status', 'portalName'];

        /**
         *
         * @type {string[]}
         * @private
         */
        this._modelSearchableFields = ['url'];
    }

    /**
     * Initializing controller
     *
     * @param callback
     */
    init(callback) {
        super.init(err => {
            if (err) return callback(err);

            this.registerAction('start-import', 'startImport');

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
    let controller = new AdminImportFeed(request, response, next);
    controller.run();
};