'use strict';

/**
 * Lodash library
 */
const _ = require('lodash');

/**
 * All regions
 *
 * @type {Array}
 */
const regions = require('../data/region');

/**
 * Core library
 */
const Core = require('nodejs-lib');

/**
 * Merge module
 */
const merge = require('merge');

/**
 * Region names
 *
 * @type {Array}
 */
const regionNames = require('../data/region-names');

//const socialAccounts = require('../data/social-accounts');

class MetaDataController {

    /**
     * Class constructor
     *
     * @param siteControllerInstance
     */
    constructor(siteControllerInstance) {

        this.siteControllerInstance = siteControllerInstance;
    }

    /**
     * Application logger getter
     *
     * @returns {Logger|exports|module.exports}
     */
    get logger() {

        return Core.ApplicationFacade.instance.logger;
    }

    /**
     * Init controller
     *
     * @param callback
     */
    init(callback) {

        /**
         * View meta data
         *
         * @type {{}}
         */
        this.siteControllerInstance.data.meta = {
            tags: {}
        };

        let parts = (this.siteControllerInstance.request.get('host') || 'realza.ru').split('.');

        if (parts.length === 3) {

            this.siteControllerInstance.data.meta.subDomain = parts.shift();
        }

        this.siteControllerInstance.data.meta.domain   = parts.join('.');
        this.siteControllerInstance.data.meta.protocol = this.siteControllerInstance.request.protocol;

        this.siteControllerInstance.data.meta.region = this.resolveCurrentRegion();

        if (!this.siteControllerInstance.data.meta.region) {

            this.logger.info(`MetaDataController::init: IP address not resolved to region, apply Moscow`);

            //this.siteControllerInstance.data.meta.region = this.getRegionByName('Москва');
        }

        /*this.siteControllerInstance.data.meta.region =
            merge(this.siteControllerInstance.data.meta.region, _.find(regionNames, {id: this.siteControllerInstance.data.meta.region.id}));

        if (['Москва', 'Санкт-Петербург'].indexOf(this.siteControllerInstance.data.meta.region.name) > -1) {

            this.siteControllerInstance.data.meta.region.isCityCenter = true;
        }*/

        //console.log(this.siteControllerInstance.data.meta);

        callback();
    }

    /**
     * Generate JSON JD content for web page
     */
    generateJsonLd(callback) {

        if (typeof this.siteControllerInstance.data.meta === 'undefined') return callback();

        let meta = this.siteControllerInstance.data.meta;

        let url = `${this.siteControllerInstance.data.httpProtocol}://`;

        if (meta.subDomain) {

            url += `${meta.subDomain}.`;
        }

        url += meta.domain;

        //let accounts = socialAccounts.get(meta.subDomain, this.siteControllerInstance.raionUrlString);

        meta.jsonLd = {
            '@context': 'http://schema.org',
            '@type': 'WebSite',
            name: 'Realza.ru',
            url: url,
            description: 'Портал недвижимости Realza.ru. Сервис для бесплатного размещения объявлений недвижимости.',
            //sameAs: accounts.map(account => account.url),
            mainEntity: {
                '@type': 'WebPage',
                name: '', // todo: @seo title here
                description: '' // todo: @seo description here
            }
        };

        if (this.siteControllerInstance.data.meta.breadcrumbs) {

            meta.jsonLd.mainEntity.breadcrumb = {
                '@type': 'BreadcrumbList',
                itemListElement: this.siteControllerInstance.data.meta.breadcrumbs.map((item, index) => {

                    return {
                        '@type': 'ListItem',
                        position: index + 1,
                        item: {
                            '@id': item.url,
                            'name': item.title
                        }
                    }
                })
            };
        }

        callback();
    }

    /**
     * Returns current region or null if region not found by name
     *
     * @returns {null}
     */
    resolveCurrentRegion() {

        if (this.siteControllerInstance.data.meta.subDomain) {

            return this.getRegionBySubDomainName(this.siteControllerInstance.data.meta.subDomain);
        }

        //console.log(this.siteControllerInstance.data);

        if (!this.siteControllerInstance.data.geoInfo.regionName) {

            return null;
        }

        let currentRegion = this.getRegionByName(this.siteControllerInstance.data.geoInfo.regionName);

        if (!currentRegion) {

            this.logger.info(`BaseSiteController::resolveCurrentRegion: unable to find region by name "${this.siteControllerInstance.data.geoInfo.regionName}"`);

            return null;
        }

        return currentRegion;
    }

    /**
     * Get region by name
     *
     * @param regionName
     */
    getRegionByName(regionName) {

        return _.find(regions, {name: regionName});
    }

    /**
     * Get region by sub domain name
     *
     * @param subDomainName
     */
    getRegionBySubDomainName(subDomainName) {

        return _.find(regions, {abbreviation: subDomainName});
    }
}

/**
 * Export Controller Class
 *
 * @type {MetaDataController}
 */
module.exports = MetaDataController;