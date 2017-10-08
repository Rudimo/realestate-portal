'use strict';

/**
 * Core library
 */
const Core = require('nodejs-lib');

/**
 * Requiring base Controller
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
 * Lodash library
 */
const _ = require('lodash');

/**
 * Application mailer
 *
 * @type {Mailer|exports|module.exports}
 */
const Mailer = require('../../libs/mailer');

/**
 * Rejected objects model
 *
 * @type {Function}
 */
//const rejectedObjectModel = require('../../models/rejected_object');

/**
 * All regions
 *
 * @type {Array}
 */
const regions = require('../../data/region');

/**
 *  UserObjects controller
 */
class AdminObjects extends AdminCRUDController {

    /**
     * Controller constructor
     */
    constructor(request, response) {
        // We must call super() in child class to have access to 'this' in a constructor
        super(request, response);

        /**
         * Current CRUD model instance
         *
         * @type {Object}
         * @private
         */
        this._model = require('../../models/object.js');

        /**
         * moderationCommentModel
         *
         * @type {Object}
         * @private
         */
        //this.moderationCommentModel = require('../../models/moderation_comment.js');

        /**
         * Context of the controller
         *
         * @type {string}
         * @private
         */
        this._baseUrl = '/admin/objects';

        /**
         * Path to controller views
         *
         * @type {string}
         * @private
         */
        this._viewsPath = 'object';

        /**
         *
         * @type {string[]}
         * @private
         */
        this._modelSearchableFields = ['title', 'description'];

        /**
         * Model includes
         * @type {*[]}
         * @private
         */
        this._modelPopulateFields = 'images user user.organization feed';
    }

    /**
     * Initializing controller
     *
     * @param callback
     */
    init(callback) {
        super.init(() => {
            this.registerAction('resave-all', 'resaveAll');

            this.data.regions = regions;

            callback();
        });
    }

    /**
     * Returns view sorting options
     *
     * @returns {{}}
     */
    getViewSorting() {

        let sorting = super.getViewSorting();

        if (Object.keys(sorting).length === 0) {

            sorting = {field: 'createdAt', order: 'desc'}; // default sorting
        }

        return sorting;
    }

    /**
     * Extract item from request
     *
     * @param item
     * @returns {{}}
     */
    getItemFromRequest(item) {
        let result = item;

        result.title = this.request.body.title;

        return result;
    }

    /**
     * Resave all items
     *
     * @param callback
     */
    resaveAll(callback) {

        this.flash.addMessage('Resave started', Core.FlashMessageType.INFO);
        this.terminate();
        this.response.redirect('/admin/objects');

        callback();

        this.model.resaveAll(err => {
            if (err) return this.logger.error(err);

            this.logger.info(`ObjectController::resaveAll: done`);
        });
    }

    /**
     * Check if current object has correct status and exists
     *
     * @returns {boolean}
     */
    isObjectIsModerationPending() {

        if (!this.item || this.item.publishStatus !== c.OBJECT_PUBLISH_STATUS_MODERATION_PENDING) {

            return false;
        }

        return true;
    }
}

/**
 * Exporting Controller
 *
 * @type {Function}
 */
module.exports = (request, response) => {
    let controller = new AdminObjects(request, response);
    controller.run();
};