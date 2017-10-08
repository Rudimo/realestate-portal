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
 * Raions controller
 */
class RaionsController extends BaseSiteController {

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

        let region = _.find(regions, {abbreviation: this.data.meta.subDomain});
        //console.log(region);

        objectModel.model.aggregate([
            {$project: {geoRaion: 1, geoObl: 1, status: 1}},
            {$match: {status: {"$in": [c.OBJECT_STATUS_PUBLISHED]}}},
            {$match: {geoObl: {"$in": [region.name]}}},
            {
                "$group": {
                    "_id": "$geoRaion",
                    "count": {"$sum": 1}
                }
            }
        ], (err, data) => {
            if (err) return console.log(err);

            for (let item of data) {
                item.enName = speakingUrl(item._id, {lang: 'ru', separator: '-'});
            }

            //console.log(data);

            //this.data.columns = _.chunk(data, Math.ceil(data.length / 3));

            this.data.columns = chunkify(data, 3, true);

            this.data.meta.breadcrumbs = [{
                url: this.obtainBreadcrumbUrl({
                    path: '/regions'
                }),
                text: 'Все регионы',
                title: 'Все объявления во всех регионах'
            }, {
                url: this.obtainBreadcrumbUrl({
                    subDomain: this.data.meta.region.abbreviation,
                    path: '/'
                }),
                text: region.name,
                title: 'Все объявления в регионе ' + region.name
            }, {
                url: this.obtainBreadcrumbUrl({
                    subDomain: this.data.meta.region.abbreviation,
                    path: '/raions'
                }),
                text: 'Районы',
                title: 'Все районы в регионе ' + region.name
            }];

            this.view(Core.View.htmlView('app/views/site/realestate/raions.swig'));

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

        let region = _.find(regions, {abbreviation: this.data.meta.subDomain});

        region = merge(region, _.find(regionNames, {id: region.id}));

        this.data.seoData.title = `Недвижимость во всех районах ${region.name2}`;
        this.data.seoData.keywords = `недвижимость, все районы, ${region.name}`;
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
module.exports = (request, response) => {
    let controller = new RaionsController(request, response);
    controller.run();
};