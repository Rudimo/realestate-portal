'use strict';

/**
 * Core library
 */
const Core = require('nodejs-lib');

/**
 * Requiring Base Controller
 *
 * @type {BaseController|exports|module.exports}
 */
const BaseController = require('../base.js');

/**
 *  Admin base controller
 */
class UserBaseController extends BaseController {

    /**
     * Pre-initialize data and event handlers
     */
    preInit(callback) {

        super.preInit(err => {
            if (err) return callback(err);

            if (!this.isAuthenticated()) {
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
exports = module.exports = UserBaseController;