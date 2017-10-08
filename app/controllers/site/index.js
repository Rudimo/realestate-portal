'use strict';

/**
 * Core library
 */
const Core = require('nodejs-lib');

/**
 * Object model
 *
 * @type {Function}
 */
const objectModel = require('../../models/object');

/**
 * Application constants
 *
 * @type {*|exports|module.exports}
 */
const c = require('../../constants');

/**
 * Lodash library
 *
 * @type {*}
 * @private
 */
const _ = require('lodash');

/**
 * All regions
 *
 * @type {Array}
 */
const regions = require('../../data/region');

/**
 * Require Base Front Controller
 *
 * @type {BaseController|exports|module.exports}
 */
const BaseController = require('./base.js');

/**
 *  Index controller
 */
class Index extends BaseController {

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
     * Preload view file
     *
     * @param callback
     */
    preLoad(callback) {
        super.preLoad(err => {
            if (err) return callback(err);

            if (this.data.meta.subDomain) return this.internalRedirect('site/realestate/index', {}, callback);

            callback();
        });
    }

    /**
     * Load view file
     *
     * @param dataReadyCallback
     */
    load(dataReadyCallback) {

        let regionRuList = [];
        for (let region of regions) {
            regionRuList.push(region.name);
        }

        objectModel.model.aggregate([
            {$project: {geoObl: 1, status: 1}},
            {$match: {status: {"$in": [c.OBJECT_STATUS_PUBLISHED]}}},
            {$match: {geoObl: {"$in": regionRuList}}},
            {
                "$group": {
                    "_id": "$geoObl",
                    "count": {"$sum": 1}
                }
            }
        ], (err, data) => {
            if (err) return console.log(err);

            for (let item of data) {
                for (let i of regions) {
                    if (item._id === i.name) {
                        item.nameUrl = i.nameUrl;
                        item.abbreviation = i.abbreviation;
                    }
                }
            }

            this.data.columns = _.chunk(data, Math.ceil(data.length / 3));

            this.view(Core.View.htmlView('app/views/site/index.swig'));

            // Send DATA_READY event
            dataReadyCallback();
        });
    }

    /**
     * Set SEO data for view
     *
     * @param callback
     */
    setSeoData(callback) {

        this.data.seoData.title = 'Портал недвижимости Realza.ru';
        this.data.seoData.keywords = `портал недвижимости, Realza.ru, портал объектов, официальный портал, база недвижимости, подать, объявление, недвижимость, россия, коммерческая, посредник, каталог, аренда, продажа, покупка, снять, сдать, купить, продать`;
        this.data.seoData.description = 'Портал недвижимости Realza.ru. Официальный портал для бесплатного размещения объявлений недвижимости.';

        callback();
    }
}

/**
 * Exporting Controller
 *
 * @type {Function}
 */
module.exports = function (request, response) {
    let controller = new Index(request, response);
    controller.run();
};
