'use strict';

/**
 * Core library
 */
const Core = require('nodejs-lib');

/**
 * Require Base Front Controller
 *
 * @type {UserBaseController|exports|module.exports}
 */
const UserBaseController = require('./base.js');

/**
 * RandomString library
 * @type {*|exports|module.exports}
 */
const randomString = require('random-string');

/**
 * Application mailer
 *
 * @type {Mailer|exports|module.exports}
 */
const Mailer = require('../../../libs/mailer');

/**
 * Application constants
 * @type {*|exports|module.exports}
 */
const c = require('../../../constants');

/**
 *  Settings controller
 */
class Settings extends UserBaseController {

    /**
     * Controller constructor
     */
    constructor(request, response, next) {
        // We must call super() in child class to have access to 'this' in a constructor
        super(request, response, next);

        /**
         * User model
         *
         * @type {UserModel|exports|module.exports}
         */
        this.userModel = require('../../../models/user');

        /**
         * Image model
         *
         * @type {ImageModel|exports|module.exports}
         */
        this.imageModel = require('../../../models/image');

        /**
         * Is this controller should handle subdomains? Yes
         *
         * @type {boolean}
         * @private
         */
        this._subDomainAllowedForController = true;
    }

    /**
     * Initializing controller
     *
     * @param callback
     */
    init(callback) {
        this.registerAction('profile');
        this.registerAction('password');
        this.registerAction('email');
        this.registerAction('email-change-cancel', 'emailChangeCancel');

        this.registerAction('upload-image', 'uploadImage');
        this.registerAction('delete-image', 'deleteImage');

        callback()
    }

    /**
     * Edit profile information information
     *
     * @param callback
     */
    load(callback) {

        this.data.profile = {
            firstName: this.request.user.firstName,
            lastName: this.request.user.lastName,
            surName: this.request.user.surName,
            phone: this.request.user.phone,
            isAgent: this.request.user.isAgent
        };

        // Expose cdnUrl only
        if (this.request.user.image) {
            this.data.profile.image = {
                cdnUrl: this.request.user.image.cdnUrl
            }
        }

        this.view(Core.View.htmlView('app/views/site/user/setting.swig'));
        callback();
    }

    profile(callback) {

        if (this.request.method === 'POST') {

            if (!this.userModel.validatePhone(this.request.body.phone)) {

                this.terminate();
                this.response.send({result: 'ERR', errors: ['Номер телефона указан неверно']});

                return callback();
            }

            this.request.user.firstName = this.request.body.firstName;
            this.request.user.lastName = this.request.body.lastName;
            this.request.user.surName = this.request.body.surName;
            this.request.user.phone = this.request.body.phone;
            this.request.user.isAgent = this.request.body.isAgent;

            this.request.user.save(err => {
                if (err) {
                    return this.onCreateOrUpdateFailed(err, callback);
                }

                this.view(Core.View.jsonView({result: 'OK'}));
                callback();
            });

        } else {

            this.terminate();
            this.response.redirect('/user/setting');
            callback();

        }

    }

    password(callback) {

        if (this.request.method === 'POST') {

            this.request.user.comparePassword(this.request.body.currentPassword, (err, isMatch) => {
                if (err) return callback(err);

                if (!isMatch) {
                    this.terminate();
                    this.response.send({result: 'ERR', errors: ['Текущий пароль указан неверно']});
                    return callback();
                }

                this.request.user.password = this.request.body.newPassword;

                this.request.user.save(err => {
                    if (err) {
                        return this.onCreateOrUpdateFailed(err, callback);
                    }

                    this.terminate();
                    this.response.send({result: 'OK'});
                    callback();
                });
            });
        } else {

            this.terminate();
            this.response.redirect('/user/setting');
            callback();

        }
    }

    email(callback) {

        if (this.request.method === 'POST') {

            if (this.request.user.email != this.request.body.currentEmail) {
                this.terminate();
                this.response.send({result: 'ERR', errors: ['Текущий E-mail адрес указан неверно']});
                return callback();
            }

            this.request.user.emailChangeRequest.toEmail = this.request.body.newEmail;
            this.request.user.emailChangeRequest.confirmationCode1 = randomString({
                length: 30,
                numeric: true,
                letters: true,
                special: false
            });
            this.request.user.emailChangeRequest.confirmationCode2 = randomString({
                length: 30,
                numeric: true,
                letters: true,
                special: false
            });
            this.request.user.emailChangeRequest.requestedAt = new Date();

            this.request.user.save(err => {
                if (err) {
                    return callback(err);
                }

                this.terminate();
                this.response.send({result: 'OK'});

                Mailer.sendMail({
                    toUserId: this.request.user.id,
                    type: c.EMAIL_TYPE_EMAIL_CHANGE_REQUEST_FROM
                });

                Mailer.sendMail({
                    toUserId: this.request.user.id,
                    type: c.EMAIL_TYPE_EMAIL_CHANGE_REQUEST_TO,
                    toEmail: this.request.body.newEmail
                });

                callback();
            });
        } else {

            this.terminate();
            this.response.redirect('/user/setting');
            callback();

        }
    }

    /**
     * Cancel change of E-mail address
     *
     * @param callback
     */
    emailChangeCancel(callback) {
        if (this.request.method === 'POST') {

            this.request.user.emailChangeRequest.toEmail = undefined;
            this.request.user.emailChangeRequest.confirmationCode1 = undefined;
            this.request.user.emailChangeRequest.confirmationCode2 = undefined;
            this.request.user.emailChangeRequest.requestedAt = undefined;

            this.request.user.save(err => {
                if (err) {
                    return callback(err);
                }

                this.flash.addMessage('Изменение E-mail адреса отменено', Core.FlashMessageType.SUCCESS);
                this.terminate();
                this.response.redirect('/user/setting');
                callback();
            });

        } else {

            this.terminate();
            this.response.redirect('/user/setting');
            callback();

        }
    }

    /**
     * Handle uploading image image
     *
     * @param callback
     */
    uploadImage(callback) {

        this.imageModel.uploadUserImage({request: this.request}, (err, image) => {
            if (err) return callback(err);

            if (this.request.user.image) {
                // Remove old image
                this.imageModel.removeById(this.request.user.image, err => {
                    if (err) this.logger.error(err);
                });
            }

            this.request.user.image = image._id;

            this.request.user.save(err => {
                if (err) return callback(err);

                this.terminate();

                this.response.send(image);

                callback();
            });
        });
    }

    /**
     * Delete organization image
     *
     * @param callback
     */
    deleteImage(callback) {

        if (!this.request.user.image) {
            this.terminate();
            this.response.send({});
            return callback();
        }

        // Remove image
        this.imageModel.removeById(this.request.user.image, err => {
            if (err) this.logger.error(err);
        });

        this.request.user.image = undefined;

        this.request.user.save(err => {
            if (err) return callback(err);

            this.terminate();

            this.response.send({});

            callback();
        });
    }
}

/**
 * Exporting Controller
 *
 * @type {Function}
 */
exports = module.exports = function (request, response, next) {
    let controller = new Settings(request, response, next);
    controller.run();
};