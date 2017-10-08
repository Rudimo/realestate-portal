'use strict';

/**
 * Core library
 */
const Core = require('nodejs-lib');

/**
 * Require Base CRUD Site Controller
 *
 * @type {BaseController|exports|module.exports}
 */
const BaseCRUDController = require('./base_crud.js');

/**
 *  AdminAclRoles controller
 */
class Image extends BaseCRUDController {

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
         * Current CRUD model instance
         *
         * @type {*}
         * @private
         */
        this._model = require('../../models/image.js');
    }

    /**
     * Init data
     *
     * @param readyCallback
     */
    init(readyCallback) {
        super.init(function (err) {
            if (err) return readyCallback(err);

            if (this.request.method === 'POST') {

                this._model.uploadObjectImage({request: this.request}, function (err, image) {
                    if (err) return readyCallback(err);

                    this.terminate();
                    this.response.send({
                        id: image.id,
                        cdnUrl: image.cdnUrl,
                        thumbnailCdnUrl: image.thumbnailCdnUrl,
                        fileName: image.fileName
                    });

                    readyCallback();
                }.bind(this));

            } else {
                readyCallback();
            }

        }.bind(this));
    }

    /**
     * Check edit permissions
     *
     * @param callback
     */
    canEdit(callback) {
        callback(new Error('Permission denied'));
    }

    /**
     * Check delete permissions
     *
     * @param callback
     */
    canDelete(callback) {
        callback(new Error('Permission denied'));
    }
}

/**
 * Exporting Controller
 *
 * @type {Function}
 */
module.exports = (request, response, next) => {
    let controller = new Image(request, response, next);
    controller.run();
};