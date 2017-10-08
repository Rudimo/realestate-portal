'use strict';

/**
 * Core library
 */
const Core = require('nodejs-lib');

/**
 * Validation module
 *
 * @type {*|exports|module.exports}
 */
const validator = require('validator');

/**
 * Require Base Front Controller
 *
 * @type {BaseController|exports|module.exports}
 */
const BaseController = require('./base.js');

/**
 *  Signup controller
 */
class SignUp extends BaseController {

    /**
     * Controller constructor
     *
     * @param request
     * @param response
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
    }

    /**
     * Initializing controller
     *
     * @param callback
     */
    init(callback) {

        this.userModel = require('../../models/user.js');
        this.data.userPasswordMinLength = 4;

        callback();
    }

    /**
     * Load view file
     *
     * @param dataReadyCallback
     */
    load(dataReadyCallback) {

        if (this.request.user) {
            this.terminate();
            this.response.redirect('/');
            return dataReadyCallback();
        }

        if (this.request.method === 'POST') {

            this.validateRecapcha(this.request.body['g-recaptcha-response'], (err, success) => {
                if (err) return dataReadyCallback(err);

                if (!success) {

                    this.flash.addMessage('Проверка на робота не пройдена', Core.FlashMessageType.ERROR);
                    this.terminate();
                    this.response.redirect('/signup');

                    return dataReadyCallback();
                }

                if (this.request.body.password !== this.request.body.password2) {
                    this.flash.addMessage('Введенные пароли не совпадают', Core.FlashMessageType.ERROR);

                    this.view(Core.View.htmlView('app/views/site/signup.swig'));
                    return dataReadyCallback();
                }

                if (!this.request.body.terms) {

                    this.flash.addMessage('Вы должны согласиться с правилами сервиса', Core.FlashMessageType.ERROR);

                    this.view(Core.View.htmlView('app/views/site/signup.swig'));
                    return dataReadyCallback();
                }

                let userData = {
                    firstName: this.request.body.firstName,
                    email: this.request.body.email,
                    phone: this.request.body.phone,
                    password: this.request.body.password,
                    isAgent: !!this.request.body.isAgent
                };

                this.userModel.register(userData, (err, user) => {

                    if (err) {
                        this.flash.addMessage(err.message, Core.FlashMessageType.ERROR);

                        this.terminate();
                        this.response.redirect('/signup');
                        return dataReadyCallback();
                    }

                    this.request.logIn(user, err => {
                        if (err) return dataReadyCallback(err);

                        this.flash.addMessage('Аккаунт был успешно создан!', Core.FlashMessageType.SUCCESS);

                        this.terminate();

                        this.response.redirect('/user/setting');

                        dataReadyCallback();
                    });
                });
            });

        } else {

            /**
             * Set output view object
             */
            this.view(Core.View.htmlView('app/views/site/signup.swig'));

            // Send DATA_READY event
            dataReadyCallback(null);
        }
    }

    /**
     * Set SEO data for view
     *
     * @param callback
     */
    setSeoData(callback) {

        this.data.seoData.title = 'Регистрация на портале Realza.ru';
        this.data.seoData.keywords = `портал недвижимости, Realza.ru, регистрация, портал объектов, официальный портал, база недвижимости, подать, объявление, недвижимость, россия, коммерческая, посредник, каталог, аренда, продажа, покупка, снять, сдать, купить, продать`;
        this.data.seoData.description = 'Регистрация на портале Realza.ru. Официальный портал для бесплатного размещения объявлений недвижимости.';

        callback();
    }
}

/**
 * Exporting Controller
 *
 * @type {Function}
 */
module.exports = function (request, response, next) {
    let controller = new SignUp(request, response, next);
    controller.run();
};
