'use strict';

/**
 * Core library
 */
const Core = require('nodejs-lib');

/**
 * Require Base Site Controller
 *
 * @type {BaseController|exports|module.exports}
 */
const BaseSiteController = require('./base.js');

/**
 * ConfirmEmail controller
 */
class ConfirmEmailController extends BaseSiteController {

    /**
     * Initializing controller
     *
     * @param callback
     */
    init(callback) {
        super.init(err => {
            if (err) return callback(err);

            // Including User Model
            this.userModel = require('../../models/user.js');

            callback();
        });
    }

    /**
     * Load view file
     *
     * @param callback
     */
    load(callback) {
        super.load(err => {
            if (err) return callback(err);

            this.userModel.findOne({
                emailVerificationCode: this.request.params.code
            }, (err, user) => {
                if (err) return callback(err);

                if (!user) {

                    this.flash.addMessage('Ссылка для подтверждения E-mail адреса неверна или устарела', Core.FlashMessageType.WARNING);
                    this.terminate();
                    this.response.redirect('/');

                    return callback();
                }

                user.emailVerificationCode = undefined;

                user.save(err => {
                    if (err) return callback(err);

                    this.flash.addMessage('E-mail адрес успешно подтвержден', Core.FlashMessageType.SUCCESS);
                    this.terminate();
                    this.response.redirect('/');

                    callback();
                });
            });
        });
    }
}

/**
 * Exporting Controller
 *
 * @type {Function}
 */
module.exports = (request, response, next) => {
    let controller = new ConfirmEmailController(request, response, next);
    controller.run();
};