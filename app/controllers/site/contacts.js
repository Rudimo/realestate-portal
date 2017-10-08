'use strict';

const Core = require('nodejs-lib');
const BaseSiteController = require('./base.js');
const _ = require('lodash');
const merge = require('merge');
const regions = require('../../data/region');
const regionNames = require('../../data/region-names');

/**
 * Contacts controller
 */
class ContactsController extends BaseSiteController {

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
     * Get region
     *
     * @returns {*}
     */
    get region() {

        let region = _.find(regions, {abbreviation: this.data.meta.subDomain});

        if (region) {

            region = merge(region, _.find(regionNames, {id: region.id}));
        }

        return region;
    }

    /**
     * Load view file
     *
     * @param callback
     */
    load(callback) {
        super.load(err => {
            if (err) return callback(err);

            if (this.isPostRequest) {
            } else {

                if (this.region) {

                    this.data.region = this.region;
                    this.view(Core.View.htmlView('app/views/site/contacts.swig'));

                } else {

                    this.view(Core.View.htmlView('app/views/site/contacts-main.swig'));
                }

                callback();
            }
        });
    }

    /**
     * Set SEO data for view
     *
     * @param callback
     */
    setSeoData(callback) {

        if (this.region) {

            this.data.seoData.title       = `Обратная связь и контакты (${this.region.name})`;
            this.data.seoData.keywords    = 'обратная связь, форма, помощь, оставить сообщение';
            this.data.seoData.description = 'Оставте свой вопрос используя форму обратной связи, мы в ближайшее время ответим Вам!';

        } else {

            this.data.seoData.title       = 'Обратная связь и контакты';
            this.data.seoData.keywords    = 'обратная связь, форма, помощь, оставить сообщение';
            this.data.seoData.description = 'Оставте свой вопрос используя форму обратной связи, мы в ближайшее время ответим Вам!';
        }

        callback();
    }
}

/**
 * Exporting Controller
 *
 * @type {Function}
 */
module.exports = (request, response, next) => {
    let controller = new ContactsController(request, response, next);
    controller.run();
};