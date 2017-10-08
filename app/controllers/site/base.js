'use strict';

/**
 * Base application controller
 *
 * @type {BaseApplicationController}
 */
const BaseApplicationController = require('../base');

/**
 * Meta data controller
 *
 * @type {MetaDataController}
 */
const MetaDataController = require('../../libs/meta-data-controller');

/**
 * AsyncJS
 */
const async = require('async');

const merge = require('merge');

/**
 * Base site controller
 */
class BaseSiteController extends BaseApplicationController {
    /**
     * Controller constructor
     */
    constructor(request, response, next) {
        // We must call super() in child class to have access to 'this' in a constructor
        super(request, response, next);

        /**
         * Is this controller should handle subdomains?
         *
         * @type {boolean}
         * @private
         */
        this._subDomainAllowedForController = false;
    }

    /**
     * Pre init controller
     *
     * @param callback
     */
    preInit(callback) {
        super.preInit(err => {
            if (err) return callback(err);

            this.metaDataController = new MetaDataController(this);

            this.metaDataController.init(err => {
                if (err) return callback(err);

                if (this.data.meta.subDomain && !this._subDomainAllowedForController) {

                    this.terminate();
                    this.next();
                }

                callback();
            });
        });
    }

    /**
     * Apply pre render action
     *
     * @param callback
     */
    preRender(callback) {
        super.preRender(err => {
            if (err) return callback(err);

            async.series([callback => {

                this.metaDataController.generateJsonLd(callback);

            }, callback => {

                this.data.seoData = {
                    url: this.data.httpProtocol + '://' + this.request.get('host') + this.request.originalUrl
                };

                this.setSeoData(callback);

            }], callback);
        });
    }

    /**
     * Set SEO data for view
     *
     * @param callback
     */
    setSeoData(callback) {

        this.data.seoData = {
            title: 'Reaza.ru',
            keywords: 'Realza.ru',
            description: 'Realza.ru - объявления о недвижимости' // TODO @seo
        };

        callback();
    }
}

/**
 * Exporting Controller
 *
 * @type {Function}
 */
module.exports = BaseSiteController;