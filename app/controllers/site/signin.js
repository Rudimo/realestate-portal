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
 *  Signin controller
 */
class SignIn extends BaseController {

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
     * @param dataReadyCallback
     */
    load(dataReadyCallback) {
        super.load(err => {
            if (err) return dataReadyCallback(err);

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
                        this.response.redirect('/signin');

                        return dataReadyCallback();
                    }

                    this.userModel.passport.authenticate('local', (err, user, info) => {
                        if (err) return dataReadyCallback(err);

                        if (!user) {
                            this.flash.addMessage(info.message, Core.FlashMessageType.ERROR);
                            this.terminate();
                            this.response.redirect('/signin');
                            return dataReadyCallback();
                        }

                        this.request.logIn(user, (err) => {
                            if (err) return dataReadyCallback(err);

                            // this.flash.addMessage('Вы успешно зашли на сайт', Core.FlashMessageType.SUCCESS);

                            this.terminate();
                            this.response.redirect('/user/objects');

                            dataReadyCallback();
                        });
                    })(this.request);
                });

            } else {
                /**
                 * Set output view object
                 */
                this.view(Core.View.htmlView('app/views/site/signin.swig'));

                dataReadyCallback();
            }
        });
    }

    /**
     * Set SEO data for view
     *
     * @param callback
     */
    setSeoData(callback) {

        this.data.seoData.title = 'Вход в личный кабинет Realza.ru';
        this.data.seoData.keywords = `портал недвижимости, Realza.ru, личный кабинет, портал объектов, официальный портал, база недвижимости, подать, объявление, недвижимость, россия, коммерческая, посредник, каталог, аренда, продажа, покупка, снять, сдать, купить, продать`;
        this.data.seoData.description = 'Вход в личный кабинет Realza.ru. Официальный портал для бесплатного размещения объявлений недвижимости.';

        callback();
    }
}

/**
 * Exporting Controller
 *
 * @type {Function}
 */
exports = module.exports = function (request, response, next) {
    let controller = new SignIn(request, response, next);
    controller.run();
};
