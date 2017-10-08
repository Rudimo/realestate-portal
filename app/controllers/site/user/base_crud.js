'use strict';

/**
 * Core library
 */
const Core = require('nodejs-lib');

/**
 * Requiring Base Controller
 *
 * @type {BaseCRUDController|exports|module.exports}
 */
const BaseCRUDController = require('../base_crud.js');

/**
 *  Admin base controller
 */
class UserBaseCRUDController extends BaseCRUDController {

    /**
     * Pre-initialize data and event handlers
     */
    preInit(callback) {

        super.preInit(err => {
            if (err) return callback(err);

            if (!this.isAuthenticated()) {
                this.request.session.returnUrl = this.request.protocol + '://' + this.request.get('host') + this.request.originalUrl;
                this.flash.addMessage('Для доступа к странице необходима авторизация!', Core.FlashMessageType.ERROR);
                this.terminate();
                this.response.redirect('/signin');
            }

            callback();
        });
    }
}

/**
 * Exporting Controller
 *
 * @type {Function}
 */
exports = module.exports = UserBaseCRUDController;