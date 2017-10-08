'use strict';

/**
 * Core library
 */
const Core = require('nodejs-lib');

/**
 * Requiring base Controller
 * @type {BaseCRUDController}
 */
const BaseCRUDController = require('./base_crud.js');

/**
* Core path module
*/
const path = require('path');

/**
 *  UserObjects controller
 */
class UserObjects extends BaseCRUDController {

    /**
     * Controller constructor
     */
    constructor(request, response, next) {
        // We must call super() in child class to have access to 'this' in a constructor
        super(request, response, next);

        /**
         * Object Mongoose model
         *
         * @type {Object}
         * @private
         */
        this.objectModel = require('../../models/object.js');

        /**
         * Context of the controller
         *
         * @type {string}
         * @private
         */
        this._baseUrl = '/objects';

        /**
         * Path to controller views
         *
         * @type {string}
         * @private
         */
        this._viewsPath = 'site/object';

        /**
         * Is this controller should handle subdomains? Yes
         *
         * @type {boolean}
         * @private
         */
        this._subDomainAllowedForController = true;
    }

    init(readyCallback) {
        super.init(err => {
            if (err) return readyCallback(err);

            this.userModel = require('../../models/user');

            readyCallback();
        });
    }

    /**
     * Handle create object form by guest user
     *
     * @param callback
     */
    create(callback) {

        if (this.request.method === 'GET') {

            //return super.create(callback);
            this.view(Core.View.htmlView('app/views/site/object/create.swig'));
            return callback();
        }

        if (this.request.body.password !== this.request.body.password2) {
            this.flash.addMessage('Введенные пароли не совпадают', Core.FlashMessageType.ERROR);

            this.view(Core.View.htmlView('app/views/site/object/create.swig'));
            return callback();
        }

        if (!this.request.body.terms) {

            this.flash.addMessage('Вы должны согласиться с правилами сервиса', Core.FlashMessageType.ERROR);

            this.view(Core.View.htmlView('app/views/site/object/create.swig'));
            return callback();
        }

        this.validateRecapcha(this.request.body['g-recaptcha-response'], (err, success) => {
            if (err) return callback(err);

            if (!success) {

                this.flash.addMessage('Проверка на робота не пройдена', Core.FlashMessageType.ERROR);
                this.terminate();
                this.response.redirect('/objects/create');

                return callback();
            }

            let userData = {
                firstName: this.request.body.firstName,
                lastName: this.request.body.lastName,
                email: this.request.body.email,
                phone: this.request.body.phone,
                password: this.request.body.password
            };

            this.userModel.register(userData, (err, user) => {

                if (err) {
                    this.flash.addMessage(err.message, Core.FlashMessageType.ERROR);

                    this.terminate();
                    this.response.redirect('/objects/create');
                    return callback();
                }

                this.request.logIn(user, err => {
                    if (err) return callback(err);

                    // Set cookie data for next form
                    this.response.cookie('objectType', this.request.body.objectType, {
                        expires: new Date(Date.now() + 900000),
                        httpOnly: false
                    });

                    this.response.cookie('offerType', this.request.body.offerType, {
                        expires: new Date(Date.now() + 900000),
                        httpOnly: false
                    });

                    this.terminate();
                    this.response.redirect('/user/objects/create');

                    callback();
                });
            });
        });
    }

    /**
     * Set SEO data for view
     *
     * @param callback
     */
    setSeoData(callback) {

        this.data.seoData.title = 'Подать бесплатное объявление недвижимости';
        this.data.seoData.keywords = `портал недвижимости, Realza.ru, подать, объявление, создать объявление, недвижимость, продажа, сдать, продать`;
        this.data.seoData.description = 'Портал недвижимости Realza.ru. Подать бесплатное объявление недвижимости.';

        callback();
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