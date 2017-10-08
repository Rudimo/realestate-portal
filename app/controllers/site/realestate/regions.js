'use strict';

/**
 * Core library
 */
const Core = require('nodejs-lib');

/**
 * Require Base Site Controller
 *
 * @type {BaseSiteController|exports|module.exports}
 */
const BaseSiteController = require('../base.js');


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
const regions = require('../../../data/region');

/**
 * Object model
 *
 * @type {Function}
 */
const objectModel = require('../../../models/object');

/**
 * Library for generating a slug
 *
 * @type {*|exports|module.exports}
 */
const speakingUrl = require('speakingurl');

/**
 * Application constants
 *
 * @type {*|exports|module.exports}
 */
const c = require('../../../constants');

/**
 * All region names
 *
 * @type {Array}
 */
const regionNames = require('../../../data/region-names');

/**
 * Merge module
 */
const merge = require('merge');

/**
 * Regions controller
 */
class RegionsController extends BaseSiteController {

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

            this.data.columns = chunkify(data, 3, true);

            this.data.meta.breadcrumbs = [{
                url: this.obtainBreadcrumbUrl({
                    path: '/'
                }),
                text: 'Главная',
                title: 'Портал недвижимости Realza.ru'
            }, {
                url: this.obtainBreadcrumbUrl({
                    path: '/regions'
                }),
                text: 'Все регионы',
                title: 'Все объявления во всех регионах'
            }];

            this.view(Core.View.htmlView('app/views/site/realestate/regions.swig'));

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

        this.data.seoData.title = `Недвижимость во всех регионах России`;
        this.data.seoData.keywords = `недвижимость, все регионы, Россия`;
        this.data.seoData.description = ``; // TODO @seo

        callback();
    }
}

function chunkify(a, n, balanced) {

    if (n < 2)
        return [a];

    let len = a.length,
        out = [],
        i   = 0,
        size;

    if (len % n === 0) {
        size = Math.floor(len / n);
        while (i < len) {
            out.push(a.slice(i, i += size));
        }
    }

    else if (balanced) {
        while (i < len) {
            size = Math.ceil((len - i) / n--);
            out.push(a.slice(i, i += size));
        }
    }

    else {

        n--;
        size = Math.floor(len / n);
        if (len % size === 0)
            size--;
        while (i < size * n) {
            out.push(a.slice(i, i += size));
        }
        out.push(a.slice(size * n));

    }

    return out;
}

/**
 * Exporting Controller
 *
 * @type {Function}
 */
module.exports = (request, response, next) => {
    let controller = new RegionsController(request, response, next);
    controller.run();
};