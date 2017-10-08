'use strict';

/**
 * Core library
 */
const Core = require('nodejs-lib');

/**
 * Require Base Site CRUD Controller
 *
 * @type {BaseSiteCRUDController|exports|module.exports}
 */
const BaseSiteCRUDController = require('../base_crud.js');

/**
 * Lodash library
 *
 * @type {_|exports|module.exports}
 * @private
 */
const _ = require('lodash');

/**
 * Application constants
 *
 * @type {*|exports|module.exports}
 */
const c = require('../../../constants');

/**
 * Offer type map
 */
const offerTypeMap = require('../../../constants/maps/offer-type-map');

/**
 * Object type map
 */
const objectTypeMap = require('../../../constants/maps/object-type-map');

/**
 * Rooms type map
 */
const roomsMap = require('../../../constants/maps/rooms-map');

/**
 * Buildings type map
 */
const buildingsMap = require('../../../constants/maps/buildings-map');

/**
 * Commercial type map
 */
const commercialMap = require('../../../constants/maps/commercial-map');

/**
 * Garage type map
 */
const garagesMap = require('../../../constants/maps/garages-map');

/**
 * Land type map
 */
const landsMap = require('../../../constants/maps/lands-map');

/**
 * All regions
 *
 * @type {Array}
 */
const regions = require('../../../data/region');

/**
 * All region names
 *
 * @type {Array}
 */
const regionNames = require('../../../data/region-names');

/**
 * All cities
 *
 * @type {Array}
 */
const cities = require('../../../data/cities');

/**
 * Merge module
 */
const merge = require('merge');

/**
 * Async library
 */
const async = require('async');

/**
 * Object has gone error
 *
 * @type {ObjectHasGoneError}
 */
const ObjectHasGoneError = require('../../../errors/object-has-gone');

class RealestateController extends BaseSiteCRUDController {

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
        this._model = require('../../../models/object.js');

        /**
         * Path to controller views
         *
         * @type {string}
         * @private
         */
        this._viewsPath = 'site/object';

        /**
         * Regular Expression for slug
         *
         * @type {RegExp}
         * @private
         */
        this._slugRegExp = new RegExp('[\\d\\w\\-]+\\-[\\w\\d]{24}');

        /**
         * Include relation
         *
         * @type {Array}
         * @private
         */
        this._modelPopulateFields = ['images', 'user.image'];

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

        // TESTING: @comment me
        /*if (Core.ApplicationFacade.instance.config.isDev && this.data.meta.subDomain === 'test') {

         region = _.find(regions, {abbreviation: 'krasnodarskiy'});
         }*/
        // TESTING: @comment me

        if (region) {

            region = merge(region, _.find(regionNames, {id: region.id}));
        }

        return region;
    }

    /**
     * Get raion string in translit
     *
     * @returns String
     */
    get raionUrlString() {

        if (this.request.params.param2 && !offerTypeMap.strToData[this.request.params.param2]) {

            return this.request.params.param2;
        }

        return null;
    }

    /**
     * Get offer type of current request
     *
     * @returns {*}
     */
    get offerType() {

        if (offerTypeMap.strToData[this.request.params.param2]) {

            return offerTypeMap.strToData[this.request.params.param2];

        } else if (offerTypeMap.strToData[this.request.params.param3]) {

            return offerTypeMap.strToData[this.request.params.param3];
        }

        return null;
    }

    /**
     * Get object type of current request
     *
     * @returns {*}
     */
    get objectType() {

        if (objectTypeMap.strToData[this.request.params.param3]) {

            return objectTypeMap.strToData[this.request.params.param3];

        } else if (objectTypeMap.strToData[this.request.params.param4]) {

            return objectTypeMap.strToData[this.request.params.param4];
        }

        return null;
    }

    /**
     * Get rooms number (for flat or room object type)
     *
     * @returns {*}
     */
    get roomsNumber() {

        if (roomsMap.strToData[this.request.params.param4]) {

            return roomsMap.strToData[this.request.params.param4];

        } else {

            return roomsMap.strToData[this.request.params.param5]
        }
    }

    /**
     * Get commercial type
     *
     * @returns {*}
     */
    get commercialType() {

        if (commercialMap.strToData[this.request.params.param4]) {

            return commercialMap.strToData[this.request.params.param4];

        } else {

            return commercialMap.strToData[this.request.params.param5]
        }
    }

    /**
     * Get building type
     *
     * @returns {*}
     */
    get buildingType() {

        if (buildingsMap.strToData[this.request.params.param4]) {

            if (this.request.params.param4 === 'dom') {
                if (buildingsMap.strToData[this.request.params.param5]) {
                    return buildingsMap.strToData[this.request.params.param5]
                } else {
                    return buildingsMap.strToData[this.request.params.param4];
                }
            } else {
                return buildingsMap.strToData[this.request.params.param4];
            }

        } else {

            return buildingsMap.strToData[this.request.params.param5]
        }
    }

    /**
     * Get land type
     *
     * @returns {*}
     */
    get landType() {

        if (landsMap.strToData[this.request.params.param4]) {

            return landsMap.strToData[this.request.params.param4];

        } else {

            return landsMap.strToData[this.request.params.param5]
        }
    }

    /**
     * Get garage type
     *
     * @returns {*}
     */
    get garageType() {

        if (garagesMap.strToData[this.request.params.param4]) {

            return garagesMap.strToData[this.request.params.param4];

        } else {

            return garagesMap.strToData[this.request.params.param5]
        }
    }

    /**
     * Get slug for current item
     *
     * @returns {*}
     */
    get slug() {

        //let slugRegExp = new RegExp('[\\d\\w\\-]+\\-[\\w\\d]{24}');

        let getIdRegExp = new RegExp('[\\w\\d]{24}');

        if (this._slugRegExp.test(this.request.params.param6)) {

            return getIdRegExp.exec(this.request.params.param6)[0];

        } else if (this._slugRegExp.test(this.request.params.param5)) {

            return getIdRegExp.exec(this.request.params.param5)[0];

        } else if (this._slugRegExp.test(this.request.params.param4)) {

            return getIdRegExp.exec(this.request.params.param4)[0];
        }

        return null;
    }

    /**
     * Get slug for current item
     *
     * @returns {*}
     */
    get fullSlug() {


        let getIdRegExp = new RegExp('[\\w\\d]{24}');

        if (this._slugRegExp.test(this.request.params.param6)) {

            return this.request.params.param6;

        } else if (this._slugRegExp.test(this.request.params.param5)) {

            return this.request.params.param5;

        } else if (this._slugRegExp.test(this.request.params.param4)) {

            return this.request.params.param4;
        }

        return null;
    }

    /**
     * Getter for current item ID
     *
     * @returns {*}
     */
    get itemId() {

        return this.slug;
    }

    /**
     * Get current page
     *
     * @returns {*}
     */
    get page() {

        let pageNumberRegexp = /^\d+$/;

        if (this.request.params.param4 === 'page') {

            if (!pageNumberRegexp.test(this.request.params.param5)) {

                return null;
            }

            return this.request.params.param5;

        } else if (this.request.params.param5 === 'page') {

            if (!pageNumberRegexp.test(this.request.params.param6)) {

                return null;
            }

            return this.request.params.param6;

        } else if (this.request.params.param6 === 'page') {

            if (!pageNumberRegexp.test(this.request.params.param7)) {

                return null;
            }

            return this.request.params.param7;
        }
    }

    /**
     * Returns view filters
     *
     * @returns {{}}
     */
    getViewFilters() {

        if (!this.offerType || !this.objectType) return {}; // For list view only

        let result = super.getViewFilters();

        result.inField.push({fieldName: 'status', fieldValue: c.OBJECT_STATUS_PUBLISHED});

        result.inField.push({fieldName: 'offerType', fieldValue: this.offerType.number});
        result.inField.push({fieldName: 'objectType', fieldValue: this.objectType.number});
        result.inField.push({fieldName: 'geoObl', fieldValue: this.region.name});

        if (this.raionUrlString) {
            result.inField.push({fieldName: 'geoRaionEnName', fieldValue: this.raionUrlString});
        }

        if (this.roomsNumber) {
            result.inField.push({fieldName: 'rooms', fieldValue: this.roomsNumber.number});
        } else if (this.commercialType) {
            result.inField.push({fieldName: 'commercialType', fieldValue: this.commercialType.number});
        } else if (this.garageType) {
            result.inField.push({fieldName: 'garageType', fieldValue: this.garageType.number});
        } else if (this.landType) {
            result.inField.push({fieldName: 'lotType', fieldValue: this.landType.number});
        } else if (this.buildingType) {
            result.inField.push({fieldName: 'houseType', fieldValue: this.buildingType.number});
        }

        return result;
    }

    /**
     * Returns view sorting options
     *
     * @returns {{}}
     */
    getViewSorting() {

        let sorting = super.getViewSorting();

        if (Object.keys(sorting).length === 0) {

            //sorting = {field: 'rating', order: 'desc'};
            sorting = {field: 'lastUpdate', order: 'desc'};
        }

        return sorting;
    }

    /**
     * Set up proper pagination base url
     *
     * @returns {*|{}}
     */
    getViewPagination() {

        let pagination = super.getViewPagination();

        if (this.offerType && this.objectType) {

            pagination.basePath = `${this.data.httpProtocol}://${this.data.meta.region.abbreviation}` +
                `.${this.data.meta.domain}`;

            if (this.data.breadcrumbsData.raion) {

                pagination.basePath += `/${this.data.breadcrumbsData.raion.nameUrl}`
            }

            pagination.basePath += `/${this.offerType.nameUrl}/${this.objectType.nameUrl}`;

            if (this.roomsNumber) {
                pagination.basePath += `/${this.roomsNumber.nameUrl}`
            } else if (this.commercialType) {
                pagination.basePath += `/${this.commercialType.nameUrl}`
            } else if (this.garageType) {
                pagination.basePath += `/${this.garageType.nameUrl}`
            } else if (this.buildingType) {
                pagination.basePath += `/${this.buildingType.nameUrl}`
            } else if (this.landType) {
                pagination.basePath += `/${this.landType.nameUrl}`
            }
        }

        return pagination;
    }

    /**
     * Pre initialize controller
     *
     * @param callback
     */
    preInit(callback) {
        super.preInit(err => {
            if (err) return callback(err);

            if (!this.validateParams()) {

                this.terminate();

                this.next();

                return callback();
            }

            // console.log(`region: ${this.region}`);
            // console.log(`raionUrlString: ${this.raionUrlString}`);
            // console.log(`offerType: ${this.offerType}`);
            // console.log(`objectType: ${this.objectType}`);
            // console.log(`roomsNumber: ${this.roomsNumber}`);
            // console.log(`commercialType: ${this.commercialType}`);
            // console.log(`garageType: ${this.garageType}`);
            // console.log(`buildingType: ${this.buildingType}`);
            // console.log(`landType: ${this.landType}`);
            // console.log(`slug: ${this.slug}`);
            // console.log(`page: ${this.page}`);

            this.data.breadcrumbsData = {
                region: this.region,
                offerType: this.offerType,
                objectType: this.objectType,
                roomsNumber: this.roomsNumber,
                commercialType: this.commercialType,
                garageType: this.garageType,
                buildingType: this.buildingType,
                landType: this.landType
            };

            //console.log(this.data.breadcrumbsData);

            if (this.slug) {

                this.request.params.action = 'view';

            } else if (this.page) {

                this.request.params.action = 'list';
                this.request.params.page = this.page;
            } else {

                this.request.params.action = 'list';
            }

            this.cacheRequestFilter();

            callback();
        });
    }

    /**
     * Initializing controller
     *
     * @param callback
     */
    init(callback) {
        super.init(err => {
            if (err) return callback(err);

            if (!this.region) {

                this.terminate();

                this.next(); // is not a valid subdomain next route ->

                return callback();
            }

            if (!this.raionUrlString) {

                return callback();
            }

            // TODO Сделать aggregate?
            this.model.model.findOne({geoObl: this.region.name, geoRaionEnName: this.raionUrlString}, (err, item) => {
                if (err) return callback(err);

                if (!item) {

                    this.terminate();

                    this.next(); // is not a valid offer type or geoRaion next route ->

                    return callback();
                }

                let raionName = item.geoRaion;

                if (!raionName) {

                    this.terminate();

                    this.next(); // is not a valid / found raion next route ->

                    return callback();
                }

                let city = _.find(cities, {name: raionName});

                this.city = city;

                this.data.breadcrumbsData.raion = {
                    name: raionName,
                    name2: city ? city.name3 : raionName,
                    nameUrl: this.raionUrlString
                };

                if (!this.slug) {

                    this.buildBreadcrumbs(); // Для странице объекта билдим позже
                }

                callback();
            });
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

            this.buildBreadcrumbs();

            if (this.offerType && this.objectType) {

                return dataReadyCallback(); // Render list of objects
            }

            /*if (this.offerType && !this.objectType) {

             this.view(Core.View.htmlView('app/views/site/realestate/index.swig'));

             dataReadyCallback();

             } else {*/

            let aggregateProject = {$project: {megaCompoundType: 1, status: 1, geoObl: 1, geoRaionEnName: 1}};
            let aggregateMatchStatus = {$match: {status: {"$in": [c.OBJECT_STATUS_PUBLISHED]}}};
            let aggregateMatchRegion = {$match: {geoObl: {"$in": [this.region.name]}}};
            let aggregateMatchRaion = {$match: {geoRaionEnName: {"$in": [this.raionUrlString]}}};
            let aggregateGroupCount = {"$group": {"_id": "$megaCompoundType", "count": {"$sum": 1}}};
            let dataCounts;

            async.series([(callback) => {
                if (this.raionUrlString) {
                    this.model.model.aggregate([
                        aggregateProject,
                        aggregateMatchStatus,
                        aggregateMatchRegion,
                        aggregateMatchRaion,
                        aggregateGroupCount

                    ], (err, data) => {
                        if (err) return console.log(err);

                        dataCounts = data;
                        callback()
                    });
                } else {
                    this.model.model.aggregate([
                        aggregateProject,
                        aggregateMatchStatus,
                        aggregateMatchRegion,
                        aggregateGroupCount

                    ], (err, data) => {
                        if (err) return console.log(err);

                        dataCounts = data;
                        callback()
                    });
                }
            }, (callback) => {

                let counts = {};

                for (let item of dataCounts) {
                    counts[item._id] = item.count;
                }

                this.data.counts = counts;

                this.view(Core.View.htmlView('app/views/site/realestate/index.swig'));

                callback();

            }], (err) => {
                if (err) return console.log(err);

                // Send DATA_READY event
                dataReadyCallback();
            });
            //}
        });

    }

    /**
     * View object
     *
     * @param dataReadyCallback
     */
    doView(dataReadyCallback) {
        super.doView(err => {
            if (err) return dataReadyCallback(err);

            //delete this.item.user.phone;

            this.data.breadcrumbsData.object = {
                name: this.item.title,
                nameUrl: this.fullSlug
            };

            this.buildBreadcrumbs();

            //let itemUrl = this.objectModel.obtainObjectUrl(this.item);

            /*if (itemUrl.indexOf(this.request.originalUrl) === -1) {

             this.data.meta.tags.linkCanonical = itemUrl;
             }*/

            dataReadyCallback();

            this.incrementViewCounter();

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

            if (this.item) { // add JSON LD

                this.data.meta.jsonLd.mainEntity.mainEntity = this.item.jsonLd;
            }

            this.data.filters = this.getViewFilters();

            callback();
        });
    };

    /**
     * Apply pre render action
     *
     * @param callback
     */
    render(callback) {

        super.render(err => {
            if (err) return callback(err);

            callback();
        });
    };

    /**
     * Prepare data for breadcrumbs
     */
    buildBreadcrumbs() {

        let bcData = this.data.breadcrumbsData;
        let realestateUrl = '';

        let breadcrumbs = [{
            url: this.obtainBreadcrumbUrl({
                path: '/regions'
            }),
            text: 'Все регионы',
            title: 'Все объявления во всех регионах'
        }];

        if (bcData && bcData.region) {

            breadcrumbs.push({
                url: this.obtainBreadcrumbUrl({
                    subDomain: this.data.meta.region.abbreviation,
                    path: '/'
                }),
                text: bcData.region.name,
                title: 'Все объявления в регионе ' + bcData.region.name
            });
        }

        if (bcData && bcData.raion) {

            realestateUrl = '/' + bcData.raion.nameUrl;

            breadcrumbs.push({
                url: this.obtainBreadcrumbUrl({
                    subDomain: this.data.meta.region.abbreviation,
                    path: realestateUrl
                }),
                text: bcData.raion.name,
                title: 'Все объявления в районе ' + bcData.raion.name
            });
        }

        if (bcData && bcData.offerType) {

            realestateUrl += '/' + bcData.offerType.nameUrl;

            breadcrumbs.push({
                url: this.obtainBreadcrumbUrl({
                    subDomain: this.data.meta.region.abbreviation,
                    path: realestateUrl
                }),
                text: capitalizeFirstLetter(bcData.offerType.text1),
                title: capitalizeFirstLetter(bcData.offerType.text2) + ' недвижимости'
            });
        }

        if (bcData && bcData.objectType) {

            realestateUrl += '/' + bcData.objectType.nameUrl;

            breadcrumbs.push({
                url: this.obtainBreadcrumbUrl({
                    subDomain: this.data.meta.region.abbreviation,
                    path: realestateUrl
                }),
                text: capitalizeFirstLetter(bcData.objectType.text2),
                title: capitalizeFirstLetter(bcData.objectType.text1)
            });
        }

        if (bcData && bcData.roomsNumber) {

            realestateUrl += '/' + bcData.roomsNumber.nameUrl;

            breadcrumbs.push({
                url: this.obtainBreadcrumbUrl({
                    subDomain: this.data.meta.region.abbreviation,
                    path: realestateUrl
                }),
                text: capitalizeFirstLetter(bcData.roomsNumber.text2),
                title: capitalizeFirstLetter(bcData.roomsNumber.text1)
            });
        }

        if (bcData && bcData.commercialType) {

            realestateUrl += '/' + bcData.commercialType.nameUrl;

            breadcrumbs.push({
                url: this.obtainBreadcrumbUrl({
                    subDomain: this.data.meta.region.abbreviation,
                    path: realestateUrl
                }),
                text: capitalizeFirstLetter(bcData.commercialType.text2),
                title: capitalizeFirstLetter(bcData.commercialType.text1)
            });
        }

        if (bcData && bcData.garageType) {

            realestateUrl += '/' + bcData.garageType.nameUrl;

            breadcrumbs.push({
                url: this.obtainBreadcrumbUrl({
                    subDomain: this.data.meta.region.abbreviation,
                    path: realestateUrl
                }),
                text: capitalizeFirstLetter(bcData.garageType.text2),
                title: capitalizeFirstLetter(bcData.garageType.text1)
            });
        }

        if (bcData && bcData.buildingType) {

            realestateUrl += '/' + bcData.buildingType.nameUrl;

            breadcrumbs.push({
                url: this.obtainBreadcrumbUrl({
                    subDomain: this.data.meta.region.abbreviation,
                    path: realestateUrl
                }),
                text: capitalizeFirstLetter(bcData.buildingType.text2),
                title: capitalizeFirstLetter(bcData.buildingType.text1)
            });
        }

        if (bcData && bcData.landType) {

            realestateUrl += '/' + bcData.landType.nameUrl;

            breadcrumbs.push({
                url: this.obtainBreadcrumbUrl({
                    subDomain: this.data.meta.region.abbreviation,
                    path: realestateUrl
                }),
                text: capitalizeFirstLetter(bcData.landType.text2),
                title: capitalizeFirstLetter(bcData.landType.text1)
            });
        }

        if (bcData && bcData.object) {

            realestateUrl += '/' + bcData.object.nameUrl;

            breadcrumbs.push({
                url: this.obtainBreadcrumbUrl({
                    subDomain: this.data.meta.region.abbreviation,
                    path: realestateUrl
                }),
                text: capitalizeFirstLetter(bcData.object.name),
                title: capitalizeFirstLetter(bcData.object.name)
            });
        }

        this.data.meta.breadcrumbs = breadcrumbs;

        // console.log(this.data.breadcrumbsData);
        // console.log(breadcrumbs);
    }

    /**
     * Increment object view counter
     */
    incrementViewCounter() {

        this.model.findById(this.item.id, (err, object) => {
            if (err) return this.logger.error(err.stack);
            if (!object) return this.logger.warning(`incrementViewCounter: Object was not found by "${this.item.id}"`);

            object.views++;

            object.save(err => {
                if (err) this.logger.error(err.stack);
            });
        });
    }

    /**
     * On item not found
     *
     * @param callback
     */
    onItemNotFound(callback) {

        callback(new ObjectHasGoneError());
    }

    /**
     * Check create permissions
     *
     * @param callback
     */
    canCreate(callback) {
        callback(new Error('Permission denied'));
    }

    /**
     * Check edit permissions
     *
     * @param callback
     */
    canEdit(callback) {
        callback(new Error('Permission denied'));
    }

    /**
     * Check delete permissions
     *
     * @param callback
     */
    canDelete(callback) {
        callback(new Error('Permission denied'));
    }

    /**
     * Set SEO data for view
     *
     * @param callback
     */
    setSeoData(callback) {

        if (this.item) {

            /*this.data.seoData = {
             url: this.item.url,
             title: this.item.title,
             keywords: this.item.title,
             description: this.item.description,
             image: ''
             };*/

            this.data.seoData = this.item.seoData;

            this.data.seoData.title = this.item.title;
            this.data.seoData.description = this.item.description;
            this.data.seoData.url = this.item.url;

            if (this.item.images.length > 0) {

                this.data.seoData.image = {
                    cdnUrl: this.item.images[0].cdnUrl
                };
            }

        } else {

            let title = '';
            let keywords = 'Realza';

            if (this.offerType) {

                title += capitalizeFirstLetter(this.offerType.text1);
                keywords += ', ' + this.offerType.text1;

                if (this.roomsNumber) {

                    title += ' ' + this.roomsNumber.text5;
                    keywords += ', ' + this.roomsNumber.text2;

                } else if (this.commercialType) {

                    title += ' ' + this.commercialType.text5;
                    keywords += ', ' + this.commercialType.text2;

                } else if (this.garageType) {

                    title += ' ' + this.garageType.text1;
                    keywords += ', ' + this.garageType.text2;

                } else if (this.buildingType) {

                    title += ' ' + this.buildingType.text5;
                    keywords += ', ' + this.buildingType.text2;

                } else if (this.landType) {

                    title += ' ' + this.landType.text4;
                    keywords += ', ' + this.landType.text2;

                } else if (this.objectType) {

                    title += ' ' + this.objectType.text2;
                    keywords += ', ' + this.objectType.text2;

                } else {

                    title += ' недвижимость';
                    keywords += ', недвижимость';
                }

            } else {

                title += 'Недвижимость';
                keywords += ', недвижимость';
            }

            if (this.city) {

                title += ' в ' + this.city.name3;
                keywords += ', ' + this.city.name;

            } else if (this.raionName) {

                title += ' ' + this.raionName;
                keywords += ', ' + this.raionName + ', ' + this.region.name;

            } else {

                title += ' в ' + this.region.name3;
                keywords += ', ' + this.region.name;
            }

            this.data.seoData.title = title;
            this.data.seoData.keywords = keywords;
            this.data.seoData.description = title; // TODO @seo
        }

        callback();
    }

    /**
     * Validate request params
     *
     * @returns {boolean}
     */
    validateParams() {

        let slugFound = false;

        //console.log(this.request.params);

        if (this.request.params.param7) { // can only be a page number

            if (!/^\d+$/.test(this.request.params.param7)) {

                return false;
            }
        }

        if (this.request.params.param6) { // can be a slug, 'page' or page number

            if (!this._slugRegExp.test(this.request.params.param6)) {

                if (this.request.params.param6 !== 'page') {

                    if (!/^\d+$/.test(this.request.params.param6)) {

                        return false;
                    }
                }

            } else {

                slugFound = true;
            }
        }

        if (this.request.params.param5) {

            if (slugFound || !this._slugRegExp.test(this.request.params.param5)) {

                if (this.request.params.param5 !== 'page') {

                    if (!/^\d+$/.test(this.request.params.param5)) {

                        if (!roomsMap.strToData[this.request.params.param5]) {

                            if (!buildingsMap.strToData[this.request.params.param5]) {

                                if (!commercialMap.strToData[this.request.params.param5]) {

                                    if (!garagesMap.strToData[this.request.params.param5]) {

                                        if (!landsMap.strToData[this.request.params.param5]) {

                                            return false;

                                        } else if (this.roomsNumber || this.buildingType || this.commercialType || this.garageType) {
                                            return false;
                                        }
                                    } else if (this.roomsNumber || this.buildingType || this.commercialType) {
                                        return false;
                                    }
                                } else if (this.roomsNumber || this.buildingType) {
                                    return false;
                                }
                            } else if (this.roomsNumber) {
                                return false;
                            }
                        }
                    }
                }

            } else {

                slugFound = true;
            }
        }

        if (this.request.params.param4) {

            if (slugFound || !this._slugRegExp.test(this.request.params.param4)) {

                if (this.request.params.param4 !== 'page') {

                    if (!objectTypeMap.strToData[this.request.params.param4]) {

                        if (!roomsMap.strToData[this.request.params.param4]) {

                            if (!buildingsMap.strToData[this.request.params.param4]) {

                                if (!commercialMap.strToData[this.request.params.param4]) {

                                    if (!garagesMap.strToData[this.request.params.param4]) {

                                        if (!landsMap.strToData[this.request.params.param4]) {

                                            return false;
                                        } else if (this.roomsNumber || this.buildingType || this.commercialType || this.garageType) {
                                            return false;
                                        }
                                    } else if (this.roomsNumber || this.buildingType || this.commercialType) {
                                        return false;
                                    }
                                } else if (this.roomsNumber || this.buildingType) {
                                    return false;
                                }
                            } else if (this.roomsNumber) {
                                return false;
                            }
                        }
                    }
                }
            }
        }

        if (this.request.params.param3) {

            if (!objectTypeMap.strToData[this.request.params.param3]) {

                if (!offerTypeMap.strToData[this.request.params.param3]) {

                    return false;
                }
            }
        }

        if (this.request.params.param2) {

            if (!offerTypeMap.strToData[this.request.params.param2]) {

                if (!this.raionUrlString) {
                }
            }
        }

        return true;
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Exporting Controller
 *
 * @type {Function}
 */
module.exports = (request, response, next) => {
    let controller = new RealestateController(request, response, next);
    controller.run();
};