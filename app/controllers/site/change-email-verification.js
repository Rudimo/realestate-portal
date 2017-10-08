'use strict';

/**
 * Core library
 */
const Core = require('nodejs-lib');

/**
 * Require Base Front Controller
 *
 * @type {BaseController|exports|module.exports}
 */
const BaseController = require('./base.js');

/**
 * Async library
 *
 * @type {async|exports|module.exports}
 */
const async = require('async');

class ChangeEmailVerificationController extends BaseController {

    /**
     * Controller constructor
     */
    constructor(request, response) {
        // We must call super() in child class to have access to 'this' in a constructor
        super(request, response);

        /**
         * User model
         *
         * @type {UserModel|Function|exports|module.exports}
         */
        this.userModel = require('../../models/user.js');
    }

    /**
     * Verify E-mail address change request
     *
     * @param callback
     */
    load(callback) {

        async.waterfall([callback => {

            this.userModel.model.findOne({
                $or: [
                    {'emailChangeRequest.confirmationCode1': this.request.params.code},
                    {'emailChangeRequest.confirmationCode2': this.request.params.code}
                ]
            }, (err, user) => {
                if (err) return callback(err);

                // TODO: Render pretty error
                if (!user) return callback(new Error(`Confirmation code is wrong`));

                callback(null, user);
            });

        }, (user, callback) => {

            if (user.emailChangeRequest.confirmationCode1 === this.request.params.code) {

                user.emailChangeRequest.confirmationCode1 = undefined;

            } else if (user.emailChangeRequest.confirmationCode2 === this.request.params.code) {

                user.emailChangeRequest.confirmationCode2 = undefined;
            }

            if (!user.emailChangeRequest.confirmationCode1 && !user.emailChangeRequest.confirmationCode2) {

                // Success!

                user.email = user.emailChangeRequest.toEmail;

                user.emailChangeRequest.toEmail     = undefined;
                user.emailChangeRequest.requestedAt = undefined;

                user.save(err => {
                    if (err) {
                        return callback(err);
                    }

                    this.flash.addMessage('E-mail адрес был успешно изменен! Войдите, используя новый E-mail.', Core.FlashMessageType.SUCCESS);

                    this.request.logout();
                    this.terminate();
                    this.response.redirect('/signin');

                    callback();
                });

            } else {

                // One E-mail verified

                user.save(err => {
                    if (err) {
                        return callback(err);
                    }

                    this.flash.addMessage('Один E-mail адрес успешно подтвержден, осталось подтвердить второй.', Core.FlashMessageType.SUCCESS);
                    this.terminate();
                    this.response.redirect('/');
                    callback();
                });
            }

        }], err => {
            if (err) return callback(err);

            callback();
        });
    }
}

/**
 * Exporting Controller
 *
 * @type {Function}
 */
module.exports = (request, response) => {
    let controller = new ChangeEmailVerificationController(request, response);
    controller.run();
};