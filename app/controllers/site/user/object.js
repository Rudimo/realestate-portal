'use strict';

/**
 * Requiring base Controller
 * @type {UserBaseCRUDController}
 */
const UserBaseCrudController = require('./base_crud.js');

/**
 * Core library
 */
const Core = require('nodejs-lib');

/**
 * Async library
 *
 * @type {async|exports|module.exports}
 */
const async = require('async');

/**
 * Application constants
 *
 * @type {*|exports|module.exports}
 */
const c = require('../../../constants');

/**
 * Lodash library
 *
 * @type {_|exports|module.exports}
 * @private
 */
const _ = require('lodash');

/**
 *  UserObjects controller
 */
class UserObjects extends UserBaseCrudController {

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
        this._model = require('../../../models/object.js');

        /**
         * Image model
         *
         * @type {ImageModel|exports|module.exports}
         */
        this.imageModel = require('../../../models/image.js');

        /**
         * Context of the controller
         *
         * @type {string}
         * @private
         */
        this._baseUrl = '/user/objects';

        /**
         * Path to controller views
         *
         * @type {string}
         * @private
         */
        this._viewsPath = 'site/user/object';

        /**
         * Include relation
         *
         * @type {Array}
         * @private
         */
        this._modelPopulateFields = ['images', 'user'];

        /**
         * Is this controller should handle subdomains? Yes
         *
         * @type {boolean}
         * @private
         */
        this._subDomainAllowedForController = true;
    }

    canView(callback) {

        console.log(this.item.user);

        if (this.isUserObject()) {
            return callback();
        }

        this.flash.addMessage('Простите, у Вас недостаточно полномочий', Core.FlashMessageType.ERROR);
        this.terminate();
        this.response.redirect('/user/objects');

        callback(new Error('Permission denied'));
    }

    canEdit(callback) {

        if (this.item.status === c.OBJECT_STATUS_PUBLISHED) {

            this.flash.addMessage(`Объявление опубликовано. Вы не можете редактировать его.`,
                Core.FlashMessageType.INFO);
            this.terminate();
            this.response.redirect('/user/objects');

            return callback(new Error('Bad request'));
        }

        if (this.isUserObject()) {
            return callback();
        }

        this.flash.addMessage('Простите, у Вас недостаточно полномочий', Core.FlashMessageType.ERROR);
        this.terminate();
        this.response.redirect('/user/objects');

        callback(new Error('Permission denied'));
    }

    canDelete(callback) {

        if (this.isUserObject()) {
            return callback();
        }

        this.flash.addMessage('Простите, у Вас недостаточно полномочий', Core.FlashMessageType.ERROR);
        this.terminate();
        this.response.redirect('/user/objects');

        callback(new Error('Permission denied'));
    }

    /**
     * Init data
     *
     * @param callback
     */
    init(callback) {
        super.init(err => {
            if (err) return callback(err);

            this.data.paramsMap = this.model.paramsMap;
            callback()
        });
    }

    /**
     * Check if current user is an owner of current object
     *
     * @returns {boolean}
     */
    isUserObject() {
        console.log(this.item.user);
        return this.request.user.id == this.item.user.id;
    }

    /**
     * Returns view filters
     *
     * @returns {{}}
     */
    getViewFilters() {
        let result = super.getViewFilters();

        result.inField.push({fieldName: 'user', fieldValue: this.userId});

        return result;
    }

    /**
     * Extract item from request
     *
     * @param item
     * @returns {{}}
     */
    getItemFromRequest(item) {

        let result = super.getItemFromRequest(item);

        result.user = this.userId;

        result.images = (this.request.body.images || []).map((image) => {
            return image.id;
        });

        // TODO СТАТУСЫ???
        if (this.request.body.status == c.OBJECT_STATUS_PUBLISHED) {
            result.status = c.OBJECT_STATUS_PUBLISHED;
        } else if (this.request.body.status == c.OBJECT_STATUS_MODERATION_PENDING) {
            result.status = c.OBJECT_STATUS_MODERATION_PENDING;
        } else {
            // Should not be public
            result.status = c.OBJECT_STATUS_ARCHIVED;
        }

        result.lastUpdate = new Date();

        return result;
    }

    /**
     * Method executes a target action
     *
     * @override
     *
     * @param $actionName - target action
     * @param callback
     */
    executeTargetAction($actionName, callback) {

        let methodName = this._allowedActions[$actionName].method;

        if (this[methodName] instanceof Function) {
            this[methodName](error => {

                if (error != null) {

                    if (['create', 'edit'].indexOf(methodName) > -1) {

                        if (error instanceof Core.ValidationError ||
                            error instanceof this.model.mongoose.Error.ValidationError) {

                            // handle validation error
                            return this.onCreateOrUpdateFailed(error, callback);
                        }
                    }

                    this.logger.warning('Failed to execute action %s. [%s]', $actionName, error.message);
                    this.logger.warning(require('util').inspect(error));

                    return callback(error);
                }

                callback();
            });

        } else {
            this._logger.warn('Specified action is not exists: %s', methodName);
            this.response.status(500).send("Specified action is not exists");
            this.terminate();
            callback(new Error("Specified action is not exists"));
        }
    }

    /**
     * On create failed
     *
     * @param err
     * @param callback
     */
    onCreateItemFailed(err, callback) {
        callback(err);
    }

    /**
     * On update failed
     *
     * @param err
     * @param callback
     */
    onUpdateItemFailed(err, callback) {
        callback(err);
    }

    /**
     * After Create object handler
     *
     * @param callback
     */
    onAfterCreate(callback) {

        super.onAfterCreate((err) => {
            if (err) return callback(err);

            async.series([callback => {

                this.updateImages(callback);

            }, callback => {

                this.terminate();
                this.response.send({id: this.data.item.id});

                callback();

            }], callback);
        });
    }

    onItemHasBeenInserted() {
        // do nothing
    }

    /**
     * After Edit Object handler
     *
     * @param callback
     */
    onAfterEdit(callback) {
        super.onAfterEdit((err) => {
            if (err) return callback(err);

            async.series([callback => {

                this.updateImages(callback);

            }, callback => {

                this.terminate();
                this.response.send({id: this.data.item.id});

                callback();

            }], callback);
        });
    }

    onItemHasBeenSaved() {
        // do nothing
    }

    /**
     * Update images
     *
     * @param callback
     */
    updateImages(callback) {

        async.waterfall([callback => {

            // Get current Object images
            this.imageModel.findAll({object: this.data.item.id}, callback);

        }, (existingImages, callback) => {

            // 1. Remove images

            let imagesIds = (this.request.body.images || []).map(function (image) {
                return image.id
            });

            let imagesIdsToRemove = [];

            existingImages.forEach(item => {
                if (imagesIds.indexOf(item.id) === -1) {
                    imagesIdsToRemove.push(item.id);
                }
            });

            console.log('Destroy images: ' + require('util').inspect(imagesIdsToRemove));

            async.eachLimit(imagesIdsToRemove, 2, (imageIdToRemove, callback) => {

                this.imageModel.findById(imageIdToRemove, (err, image) => {
                    if (err) return callback(err);
                    if (!image) {
                        this.logger.warning('UserObjects::updateImages: Image not found by ID: ' + imageIdToRemove);
                        return callback();
                    }

                    image.remove(callback);
                });
            }, callback);

        }, callback => {

            // 2. Update/Add images

            async.eachLimit(this.request.body.images, 5, (image, callback) => {

                console.log('Update/Add image: ' + require('util').inspect(image));

                this.imageModel.findById(image.id, (err, imageInstance) => {
                    if (err) return callback(err);
                    if (!imageInstance) {
                        this.logger.warning('UserObjects::updateImages: Image not found by ID: ' + image.id);
                        return callback();
                    }

                    imageInstance.title = image.title;
                    imageInstance.object = this.data.item.id;

                    imageInstance.save(callback);
                });

            }, callback);

        }], callback);
    }
}

/**
 * Exporting Controller
 *
 * @type {Function}
 */
exports = module.exports = function (request, response, next) {
    let controller = new UserObjects(request, response, next);
    controller.run();
};