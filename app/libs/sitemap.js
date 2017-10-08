'use strict';

const Core      = require('nodejs-lib');
const fs        = require('fs');
const os        = require('os');
const async     = require('async');
const path      = require('path');
const moment    = require('moment');
const _         = require('lodash');
const XMLWriter = require('xml-writer');

const c       = require('../constants');
const regions = require('../data/region');


/**
 * Sitemap class
 */
class SiteMap {

    /**
     * Sitemap constructor
     */
    constructor() {

        /** Object Model */
        this.objectModel = require('../models/object.js');

        this._logger = Core.ApplicationFacade.instance.logger;

        this.realestateUrls = [

            '/kupit',

            '/kupit/kvartira',
            '/kupit/kvartira/odnokomnatnaya',
            '/kupit/kvartira/dvuhkomnatnaya',
            '/kupit/kvartira/trekhkomnatnaya',
            '/kupit/kvartira/chetyrekhkomnatnaya',
            '/kupit/kvartira/pyatikomnatnaya',
            '/kupit/kvartira/studiya',
            '/kupit/kvartira/svobodnaya-planirovka',

            '/kupit/komnata',

            '/kupit/dom',
            '/kupit/dom/dom',
            '/kupit/dom/kottedzh',
            '/kupit/dom/dacha',
            '/kupit/dom/taunhaus',
            '/kupit/dom/chasti-doma',

            '/kupit/uchastok',
            '/kupit/uchastok/individualnoe-stroitelstvo',
            '/kupit/uchastok/v-sadovodstve',
            '/kupit/uchastok/fermerskiy',

            '/kupit/garazh',
            '/kupit/garazh/mashinomesto',
            '/kupit/garazh/garazh',
            '/kupit/garazh/boks',

            '/kupit/kommercheskaya-nedvizhimost',
            '/kupit/kommercheskaya-nedvizhimost/ofis',
            '/kupit/kommercheskaya-nedvizhimost/torgovoe-pomeshenie',
            '/kupit/kommercheskaya-nedvizhimost/pomeshenie-svobodnogo-naznacheniya',
            '/kupit/kommercheskaya-nedvizhimost/obshepit',
            '/kupit/kommercheskaya-nedvizhimost/avtoservis',
            '/kupit/kommercheskaya-nedvizhimost/gotovyi-biznes',
            '/kupit/kommercheskaya-nedvizhimost/zemelnyi-uchastok',
            '/kupit/kommercheskaya-nedvizhimost/gostinica',
            '/kupit/kommercheskaya-nedvizhimost/sklad',
            '/kupit/kommercheskaya-nedvizhimost/proizvodstvennoe-pomeshenie',

            '/snyat',

            '/snyat/kvartira',
            '/snyat/kvartira/odnokomnatnaya',
            '/snyat/kvartira/dvuhkomnatnaya',
            '/snyat/kvartira/trekhkomnatnaya',
            '/snyat/kvartira/chetyrekhkomnatnaya',
            '/snyat/kvartira/pyatikomnatnaya',
            '/snyat/kvartira/studiya',
            '/snyat/kvartira/svobodnaya-planirovka',

            '/snyat/komnata',

            '/snyat/dom',
            '/snyat/dom/dom',
            '/snyat/dom/kottedzh',
            '/snyat/dom/dacha',
            '/snyat/dom/taunhaus',
            '/snyat/dom/chasti-doma',

            '/snyat/garazh',
            '/snyat/garazh/mashinomesto',
            '/snyat/garazh/garazh',
            '/snyat/garazh/boks',

            '/snyat/kommercheskaya-nedvizhimost',
            '/snyat/kommercheskaya-nedvizhimost/ofis',
            '/snyat/kommercheskaya-nedvizhimost/torgovoe-pomeshenie',
            '/snyat/kommercheskaya-nedvizhimost/pomeshenie-svobodnogo-naznacheniya',
            '/snyat/kommercheskaya-nedvizhimost/obshepit',
            '/snyat/kommercheskaya-nedvizhimost/avtoservis',
            '/snyat/kommercheskaya-nedvizhimost/gotovyi-biznes',
            '/snyat/kommercheskaya-nedvizhimost/yuridicheskiy-adres',
            '/snyat/kommercheskaya-nedvizhimost/zemelnyi-uchastok',
            '/snyat/kommercheskaya-nedvizhimost/gostinica',
            '/snyat/kommercheskaya-nedvizhimost/sklad',
            '/snyat/kommercheskaya-nedvizhimost/proizvodstvennoe-pomeshenie',
        ];
        this.objectUrls     = [];

        this.httpDomain   = Core.ApplicationFacade.instance.config.env.HTTP_DOMAIN;
        this.httpProtocol = Core.ApplicationFacade.instance.config.env.HTTP_PROTOCOL + '://';
        this.siteUrl      = `${this.httpProtocol}${this.httpDomain}`;
    }

    /**
     * Application logged getter
     *
     * @returns {*|exports|module.exports}
     */
    get logger() {
        return this._logger;
    }

    generateSitemap(callback) {

        this.generateIndexSitemap();

        for (let region of regions) {

            this.objectModel.model.aggregate([
                {$project: {geoRaionEnName: 1, geoObl: 1}},
                {$match: {geoObl: {"$in": [region.name]}}},
                {
                    "$group": {
                        "_id": "$geoRaionEnName"
                    }
                }
            ], (err, data) => {
                if (err) return callback(err);

                if (data.length !== 0) {

                    let raionArray = [];

                    for (let item of data) {
                        raionArray.push(item._id);
                    }

                    async.waterfall([callback => {

                        this.getObjectUrl(region, callback);

                    }, callback => {

                        let params = {
                            region: region,
                            raions: raionArray,
                            objectUrls: this.objectUrls
                        };

                        this.oneRecord(params, callback);

                    }], err => {
                        if (err) return callback(err);

                    });

                } else {

                    let params = {
                        region: region
                    };

                    this.oneRecord(params, callback);

                }
            });

        }

        callback();

    }

    getObjectUrl(region, callback) {

        this.objectModel.model.aggregate([
            {$project: {geoObl: 1, status: 1, url: 1}},
            {$match: {geoObl: {"$in": [region.name]}}},
            {$match: {status: {"$in": [c.OBJECT_STATUS_PUBLISHED]}}},
            {
                "$group": {
                    "_id": "$url"
                }
            }
        ], (err, data) => {
            if (err) return callback(err);

            let urlArray = [];

            for (let item of data) {
                urlArray.push(item._id);
            }

            /**
             *  clear the array from the previous iteration
             */
            this.objectUrls.length = 0;

            this.objectUrls = urlArray;

            callback();

        });

    }

    oneRecord(params, callback) {

        let indexUrl = `${this.httpProtocol}${params.region.abbreviation}.${this.httpDomain}`;

        let xw = new XMLWriter;
        xw.startDocument('1.0', 'UTF-8');

        xw.startElement('urlset');
        xw.writeAttribute('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');

        // index page
        xw.startElement('url');

        xw.startElement('loc');
        xw.text(indexUrl);
        xw.endElement('loc');

        xw.startElement('lastmod');
        xw.text(moment().format('YYYY-MM-DD'));
        xw.endElement('lastmod');

        xw.endElement('url');

        // contact page
        xw.startElement('url');

        xw.startElement('loc');
        xw.text(`${indexUrl}/contacts`);
        xw.endElement('loc');

        xw.startElement('lastmod');
        xw.text(moment().format('YYYY-MM-DD'));
        xw.endElement('lastmod');

        xw.endElement('url');

        if (params.raions) {

            this.realestateUrls.forEach(url => {

                // realza.ru/kupit...
                xw.startElement('url');

                xw.startElement('loc');
                xw.text(`${this.httpProtocol}${params.region.abbreviation}.${this.httpDomain}${url}`);
                xw.endElement('loc');

                xw.startElement('lastmod');
                xw.text(moment().format('YYYY-MM-DD'));
                xw.endElement('lastmod');

                xw.endElement('url');

                params.raions.forEach(raion => {

                    let fullUrl = `${this.httpProtocol}${params.region.abbreviation}.${this.httpDomain}`;

                    // realza.ru/raion/kupit...
                    if (raion) {
                        fullUrl += `/${raion}${url}`;


                        xw.startElement('url');

                        xw.startElement('loc');
                        xw.text(fullUrl);
                        xw.endElement('loc');

                        xw.startElement('lastmod');
                        xw.text(moment().format('YYYY-MM-DD'));
                        xw.endElement('lastmod');

                        xw.endElement('url');

                    }
                });
            });

            params.objectUrls.forEach(url => {

                xw.startElement('url');

                xw.startElement('loc');
                xw.text(url);
                xw.endElement('loc');

                xw.startElement('lastmod');
                xw.text(moment().format('YYYY-MM-DD'));
                xw.endElement('lastmod');

                xw.endElement('url');

            });

        } else {

            this.realestateUrls.forEach(url => {

                let fullUrl = `${this.httpProtocol}${params.region.abbreviation}.${this.httpDomain}`;

                // realza.ru/kupit...
                let primaryUrl = fullUrl + url;

                xw.startElement('url');

                xw.startElement('loc');
                xw.text(primaryUrl);
                xw.endElement('loc');

                xw.startElement('lastmod');
                xw.text(moment().format('YYYY-MM-DD'));
                xw.endElement('lastmod');

                xw.endElement('url');

            });

        }

        xw.endElement('urlset');

        xw.endDocument();

        let publicPath = path.join(__dirname, '..', '..', 'public-dynamic', 'sitemap');

        fs.writeFile(`${publicPath}/${params.region.abbreviation}-sitemap.xml`, xw, (err) => {
            if (err) {
                this.logger.error(err);
                return console.log(err);
            }

            this.logger.log(`${params.region.abbreviation}-sitemap.xml Updated`);

            callback();

        });

    }

    generateIndexSitemap () {

        let indexUrl = [
            `${this.siteUrl}`,
            `${this.siteUrl}/regions`,
            `${this.siteUrl}/objects/create`,
            `${this.siteUrl}/signin`,
            `${this.siteUrl}/signup`,
            `${this.siteUrl}/contacts`,
        ];

        let xw = new XMLWriter;
        xw.startDocument('1.0', 'UTF-8');

        xw.startElement('urlset');
        xw.writeAttribute('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');

        indexUrl.forEach(url => {
            xw.startElement('url');

            xw.startElement('loc');
            xw.text(url);
            xw.endElement('loc');

            xw.startElement('lastmod');
            xw.text(moment().format('YYYY-MM-DD'));
            xw.endElement('lastmod');

            xw.endElement('url');
        });

        xw.endElement('urlset');

        xw.endDocument();

        //let publicPath = path.join(__dirname, '..', '..', 'public', 'sitemap');
        let publicPath = path.join(__dirname, '..', '..', 'public-dynamic', 'sitemap');

        fs.writeFile(`${publicPath}/sitemap.xml`, xw, (err) => {
            if (err) {
                this.logger.error(err);
                return console.log(err);
            }

            this.logger.log(`sitemap.xml Updated`);

        });

    }
}

/**
 * Exporting Class
 *
 * @type {Function}
 */
module.exports = SiteMap;