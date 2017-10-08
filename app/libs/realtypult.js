'use strict';

/**
 * Requiring Core Library
 */
const Core = require('nodejs-lib');

const rpImporter = require('nodejs-realtypult-partner-lib').Importer;

/**
 * fs core module
 *
 * @type {exports|module.exports}
 */
const fs = require('fs');

/**
 * os core library
 *
 * @type {exports|module.exports}
 */
const os = require('os');

/**
 * RandomString module
 *
 * @type {*|exports|module.exports}
 */
const randomstring = require('randomstring');

/**
 * Async module
 *
 * @type {async|exports|module.exports}
 */
const async = require('async');

/**
 * Core path library
 *
 * @type {exports|module.exports}
 */
const path = require('path');

/**
 * Requiring core Events module
 */
const events = require('events');

/**
 * Application constants
 * @type {*|exports|module.exports}
 */
const c = require('../constants');

/**
 * Util library
 *
 * @type {exports|module.exports}
 */
const util = require('util');

/**
 * Moment library
 *
 * @type {*|exports|module.exports}
 */
const moment = require('moment');

/**
 * Lodash library
 *
 * @type {_|exports|module.exports}
 * @private
 */
const _ = require('lodash');


/**
 * Application downloader
 *
 * @type {Downloader|exports|module.exports}
 */
const Downloader = require('./http/downloader');

const xml2js = require('xml2js');
const md5 = require('md5');

/**
 * File checksumm calculation
 *
 * @type {checksum|exports|module.exports}
 */
const checksum = require('checksum');

const MAX_NR_OF_IMAGES_PER_OBJECT = 10;
const MAX_NR_OF_IMAGES_TO_HANDLE_PER_TIME = 10;
const MAX_NR_OF_IMAGES_TO_DELETE_PER_TIME = 10;
const TIME_TO_WAIT_FOR_OBJECT_POST_HOOKS = 25;

/**
 * Importer class
 */
class Importer {

    /**
     * Importer constructor
     */
    constructor() {

        /** Feed to process */
        this.importFeed = null;

        /** Import Feed Model */
        this.importFeedModel = require('../models/import_feed.js');

        /** Object Model */
        this.objectModel = require('../models/object');

        /** Address Model */
        this.addressModel = require('../models/address');

        /** User Model */
        this.userModel = require('../models/user');

        /** Image Model */
        this.imageModel = require('../models/image');

        /** Was file modified or not */
        this.fileWasNotChanged = false;

        this._logger = Core.ApplicationFacade.instance.logger;

    }

    /**
     * Application logged getter
     *
     * @returns {*|exports|module.exports}
     */
    get logger() {
        return this._logger;
    }

    rmImportFeed(callback) {

        let $this = this;

        const publicPath = path.join(__dirname, '..', '..', 'public-dynamic', 'rm-report.xml');

        let importer = new rpImporter({
            //xmlFeedUrl: 'http://rz.ru:5000/testing/xml/demo-realtypult-feed.xml',
            xmlFeedUrl: 'https://api.realtypult.ru/xml/export/partner/realtypult/xJKr3BPLvMQoVKUBOguwuY1Fg',
            reportFileLocation: publicPath,
            format: 'realtypult',
            onItem: onItem,
            onEnd: onEnd,
            onError: onError
        });

        function onItem(item, callback) {
            $this.onItem(item, callback)
        }

        function onEnd(report) {
            $this.onEnd(report, callback);

            callback();

        }

        function onError(error) {
            $this.onError(error)
        }

        importer.run();
    }



    onItem(refinedItem, callback) {

        this.handleFeedItem(refinedItem, callback);
    }

    onEnd(report, callback) {

        this.logger.info(`RP Importer:: handling feed SUCCESS`);

        console.log(report);

        callback()

    }

    onError(error) {

        console.log(error);
    }

    handleFeedItem(refinedItem, callback) {

        let object;

        this.logger.info(`RP Importer:: handling feed object: ${refinedItem.id}`);
        //console.log(refinedItem);

        refinedItem.xmlMD5 = md5(refinedItem);

        let objectWasNotChanged = false;
        let objectWasCreated    = false;

        let actualImageIds;

        async.waterfall([callback => {

            this.logger.log('Importer::handleFeedItem: getting current object');

            // Try to find this object
            this.objectModel.model.findOne({
                rpFeedItemId: refinedItem.id
            }).exec((err, object) => {

                if (err) return callback(err);

                this.logger.log('Importer::handleFeedItem: getting current object, done');

                callback(null, object);
            });

        }, (object, callback) => {

            if (object) {

                if (object.xmlMD5 === refinedItem.xmlMD5) { // Object was not changed

                    this.logger.log('Object was not changed: ' + refinedItem.id);

                    object.lastUpdate = new Date();

                    objectWasNotChanged = true;

                } else {

                    object.lastUpdate = new Date();
                    object.xmlMD5     = refinedItem.xmlMD5;

                    // Object was changed
                    this.logger.log('Object was changed: ' + refinedItem.id);
                }

                callback(null, object);

            } else {
                this.logger.log('Object will be created: ' + refinedItem.id);

                callback(null, null);
            }

        }, (object, callback) => {

            if (objectWasNotChanged) return callback(null, object);

            /** Создаем новый объект */
            if (object == null) {

                object = new this.objectModel.model({
                    rpFeedItemId: refinedItem.id,
                    xmlMD5: refinedItem.xmlMD5
                });

                objectWasCreated = true;
            }

            object = this.prepareObjectInstance(object, refinedItem);

            // Resolve address
            this.addressModel.resolveOneAddress(refinedItem.address.geoAddress, (err, address) => {

                if (err) {

                    if (err.message.indexOf('too many requests') > -1 || err.message.indexOf('yandex') > -1) {

                        this.logger.error(err);
                    }

                    return callback({error: 'Не удалось распознать адрес объекта'});
                }

                this.logger.log('Importer::handleFeedItem: address resolved');

                console.log(address);

                object.geoAddress   = address.geoAddress;
                object.geoObl       = address.geoObl;
                object.geoRaion     = address.geoRaion;
                object.geoPlace     = address.geoPlace;
                object.geoStreet    = address.geoStreet;
                object.geoHouse     = address.geoHouse;
                object.geoCityRaion = address.geoCityRaion;
                object.geoMetro     = address.geoMetro;
                object.geoDistance  = address.geoDistance;
                object.geoLatitude  = address.geoLatitude;
                object.geoLongitude = address.geoLongitude;

                callback(null, object);
            });

        }, (object, callback) => {

            // validate object with Mongoose validators
            object.validate(err => {
                if (err) return callback(err);

                callback(null, object);
            });

        }, (object, callback) => {

            // validate object with application validators
            this.objectModel.validate(object.toObject({getters: true}), err => {
                if (err) return callback(err);

                callback(null, object);
            });

        }, (object, callback) => {

            if (objectWasNotChanged) return callback(null, object);

            // link user
            this.findUserOrCreate(refinedItem.user, (err, user) => {
                if (err) return callback(err);

                this.logger.log('Importer::handleFeedItem: findUserOrCreate done');

                object.user = user.id;

                callback(null, object);
            });

        }, (object, callback) => {

            if (objectWasNotChanged) return callback(null, object, null);

            if (!refinedItem.images) return callback(null, object, null);
            // Handle images
            this.getImages(object, refinedItem.images.image, (err, images) => {
                if (err) return callback(err);

                this.logger.log('Importer::handleFeedItem: getImages done');

                actualImageIds = images.map(image => image.id);

                this.logger.debug(`Number of images: ${images.length}`);

                callback(null, object, images);
            });

        }, (object, images, callback) => {

            if (objectWasNotChanged) return callback(null, object);

            if (!refinedItem.images) return callback(null, object);

            this.updateImages(object, images, err => {
                if (err) return callback(err);

                this.logger.log('Importer::handleFeedItem: updateImages done');

                callback(null, object);
            });

        }, (object, callback) => {

            //object = this.updatePublication(object);

            if (typeof actualImageIds !== 'undefined') {

                object.images = actualImageIds;
            }

            object.save(err => {

                if (err) return callback(err);

                this.logger.log('Importer::handleFeedItem: object saved');

                setTimeout(() => {
                    // Wait for `post` hooks. Do now allow memory overflow here.
                    callback(null, object);
                }, TIME_TO_WAIT_FOR_OBJECT_POST_HOOKS);
            });

        }], (err, object) => {
            if (err) {
                console.log(err);
                return callback({error: 'Произошел технический сбой'});
            }

            if (object.views > 0) {
                callback({url: object.url, views: object.views});
            } else {
                callback({url: object.url});
            }
        })
    }

    prepareObjectInstance(object, refinedItem) {

        object.status = c.OBJECT_STATUS_PUBLISHED;

        object.objectType = refinedItem.objectType;
        object.offerType  = refinedItem.offerType;
        object.price       = refinedItem.price;
        object.description = refinedItem.description;

        if (+object.objectType === c.RZ_OBJECT_TYPE_FLAT) {
            object.floor               = refinedItem.floor;
            object.floorsTotal         = refinedItem.floors;

            if ([1,2,3,4,5].indexOf(+refinedItem.rooms) > -1) {
                object.rooms = refinedItem.rooms
            }

            if (+refinedItem.rooms > 5) {
                object.rooms = c.RZ_ROOMS_TYPE_FIVE;
            }

            object.squareTotal         = refinedItem.squareTotal;
            object.squareLiving        = refinedItem.squareLiving;
            object.squareKitchen       = refinedItem.squareKitchen;
            object.agentFee            = refinedItem.agentCommission;
            convertToBoolean('mortgage', refinedItem.mortgagePossible);

            if (refinedItem.rentDeposit) {
                object.rentPledge = true;
            }

            object.yearBuild           = refinedItem.yearBuild;

            switch (+refinedItem.wallMaterial) {
                case 1:
                    object.buildingType = c.RZ_BUILDING_TYPE_BRICK;
                    break;
                case 2:
                    object.buildingType = c.RZ_BUILDING_TYPE_MONOLITHIC;
                    break;
                case 3:
                    object.buildingType = c.RZ_BUILDING_TYPE_PANEL;
                    break;
            }

            object.ceilingHeight       = refinedItem.ceilingHeight;
            object.bathroom            = refinedItem.wcType;

            switch (+refinedItem.floorMaterial) {
                case 2:
                    object.covering = c.RZ_FLOOR_COVERING_TYPE_LINOLEUM;
                    break;
                case 3:
                    object.covering = c.RZ_FLOOR_COVERING_TYPE_PARQUET;
                    break;
                case 4:
                    object.covering = c.RZ_FLOOR_COVERING_TYPE_CARPETING;
                    break;
                case 5:
                    object.covering = c.RZ_FLOOR_COVERING_TYPE_LAMINATE;
                    break;
            }

            switch (+refinedItem.viewType) {
                case 1:
                    object.windowViewStreet = true;
                    break;
                case 2:
                    object.windowViewYard = true;
                    break;
                case 3:
                    object.windowViewStreet = true;
                    object.windowViewYard = true;
                    break;
            }

            object.parkingType         = refinedItem.parkingType;

            object.balcony  = refinedItem.balconyType;
            if (+refinedItem.balconyType === 3) {
                object.balcony = c.RZ_BALCONY_TYPE_BALCONY
            }

            convertToBoolean('lift', refinedItem.passengerLift);
            convertToBoolean('serviceLift', refinedItem.serviceLift);
            convertToBoolean('television', refinedItem.television);
            convertToBoolean('rubbishChute', refinedItem.rubbishChute);
            convertToBoolean('roomFurniture', refinedItem.furniture);
            convertToBoolean('aircondition', refinedItem.airConditioner);
            convertToBoolean('buildInTech', refinedItem.householdAppliances);
            convertToBoolean('phone', refinedItem.phone);
            convertToBoolean('internet', refinedItem.internet);
        }

        if (+object.objectType === c.RZ_OBJECT_TYPE_ROOM) {

            object.floor               = refinedItem.floor;
            object.floorsTotal         = refinedItem.floors;

            if ([1,2,3,4,5].indexOf(+refinedItem.rooms) > -1) {
                object.rooms = refinedItem.rooms
            }

            if (+refinedItem.rooms > 5) {
                object.rooms = c.RZ_ROOMS_TYPE_FIVE;
            }

            switch (+refinedItem.wallMaterial) {
                case 1:
                    object.buildingType = c.RZ_BUILDING_TYPE_BRICK;
                    break;
                case 2:
                    object.buildingType = c.RZ_BUILDING_TYPE_MONOLITHIC;
                    break;
                case 3:
                    object.buildingType = c.RZ_BUILDING_TYPE_PANEL;
                    break;
            }

            object.squareTotal         = refinedItem.squareTotal;
            object.squareLiving        = refinedItem.squareLiving;
            object.squareKitchen       = refinedItem.squareKitchen;

            if ([1,2,3,4,5].indexOf(+refinedItem.roomsInDeal) > -1) {
                object.roomsOffered = refinedItem.roomsInDeal
            }

            object.ceilingHeight       = refinedItem.ceilingHeight;
            object.bathroom            = refinedItem.wcType;

            switch (+refinedItem.floorMaterial) {
                case 2:
                    object.covering = c.RZ_FLOOR_COVERING_TYPE_LINOLEUM;
                    break;
                case 3:
                    object.covering = c.RZ_FLOOR_COVERING_TYPE_PARQUET;
                    break;
                case 4:
                    object.covering = c.RZ_FLOOR_COVERING_TYPE_CARPETING;
                    break;
                case 5:
                    object.covering = c.RZ_FLOOR_COVERING_TYPE_LAMINATE;
                    break;
            }

            switch (+refinedItem.viewType) {
                case 1:
                    object.windowViewStreet = true;
                    break;
                case 2:
                    object.windowViewYard = true;
                    break;
                case 3:
                    object.windowViewStreet = true;
                    object.windowViewYard = true;
                    break;
            }

            object.balcony  = refinedItem.balconyType;
            if (+refinedItem.balconyType === 3) {
                object.balcony = c.RZ_BALCONY_TYPE_BALCONY
            }

            convertToBoolean('lift', refinedItem.passengerLift);
            convertToBoolean('serviceLift', refinedItem.serviceLift);
            convertToBoolean('television', refinedItem.television);
            convertToBoolean('rubbishChute', refinedItem.rubbishChute);
            convertToBoolean('roomFurniture', refinedItem.furniture);
            convertToBoolean('aircondition', refinedItem.airConditioner);
            convertToBoolean('buildInTech', refinedItem.householdAppliances);
            convertToBoolean('phone', refinedItem.phone);
            convertToBoolean('internet', refinedItem.internet);
            object.agentFee            = refinedItem.agentCommission;

            if (refinedItem.rentDeposit) {
                object.rentPledge = true;
            }

            convertToBoolean('mortgage', refinedItem.mortgagePossible);
            object.yearBuild           = refinedItem.yearBuild;
            object.parkingType         = refinedItem.parkingType;
        }

        if (+object.objectType === c.RZ_OBJECT_TYPE_HOUSE) {

            object.houseType           = refinedItem.buildingType;
            object.houseFloors         = refinedItem.floors;
            object.houseArea         = refinedItem.squareTotal;
            object.lotArea             = refinedItem.squareLand;
            if (refinedItem.squareLand) {
                object.lotAreaUnit = c.RZ_LOT_AREA_UNIT_AR
            }
            object.toilet              = refinedItem.toiletType;
            convertToBoolean('heatingSupply', refinedItem.heating);
            convertToBoolean('gasSupply', refinedItem.gas);
            convertToBoolean('electricitySupply', refinedItem.electricity);
            convertToBoolean('waterSupply', refinedItem.water);
            convertToBoolean('sewerageSupply', refinedItem.sewerage);
            convertToBoolean('pmg', refinedItem.permanentResidence);
            convertToBoolean('sauna', refinedItem.sauna);
            object.agentFee            = refinedItem.agentCommission;

            if (refinedItem.rentDeposit) {
                object.rentPledge = true;
            }

            convertToBoolean('mortgage', refinedItem.mortgagePossible);
        }

        if (+object.objectType === c.RZ_OBJECT_TYPE_LAND) {

            if (+refinedItem.landType === 1) {
                object.lotType = c.RZ_LOT_TYPE_IGS
            } else if (+refinedItem.landType === 2) {
                // TODO ШЛЕМ НАХУЙ
                object.lotType = c.RZ_LOT_TYPE_IGS
            }

            object.lotArea             = refinedItem.squareLand;
            if (refinedItem.squareLand) {
                object.lotAreaUnit = c.RZ_LOT_AREA_UNIT_AR
            }
        }

        if (+object.objectType === c.RZ_OBJECT_TYPE_GARAGE) {

            if ([1,2,3].indexOf(+refinedItem.garageType) > -1) {
                object.garageType = c.RZ_GARAGE_TYPE_GARAGE
            } else if (+refinedItem.garageType === 4) {
                object.garageType = c.RZ_GARAGE_TYPE_PARKING_PLACE
            }

            object.garageArea         = refinedItem.squareTotal;
        }

        if (+object.objectType === c.RZ_OBJECT_TYPE_COMMERCIAL) {

            switch (+refinedItem.commercialType) {
                case 1:
                    object.commercialType = c.RZ_COMMERCIAL_TYPE_WAREHOUSE;
                    break;
                case 2:
                    object.commercialType = c.RZ_COMMERCIAL_TYPE_MANUFACTURING;
                    break;
                case 3:
                    object.commercialType = c.RZ_COMMERCIAL_TYPE_RETAIL;
                    break;
                case 4:
                    object.commercialType = c.RZ_COMMERCIAL_TYPE_OFFICE;
                    break;
                case 5: // TODO ШЛЕМ НАХУЙ
                    object.commercialType = c.RZ_COMMERCIAL_TYPE_FREE_PURPOSE;
                    break;
                case 6:
                    object.commercialType = c.RZ_COMMERCIAL_TYPE_AUTO_REPAIR;
                    break;
                case 7:
                    object.commercialType = c.RZ_COMMERCIAL_TYPE_BUSINESS;
                    break;
                case 8:
                    object.commercialType = c.RZ_COMMERCIAL_TYPE_FREE_PURPOSE;
                    break;
                case 9:
                    object.commercialType = c.RZ_COMMERCIAL_TYPE_HOTEL;
                    break;
                case 10:
                    object.commercialType = c.RZ_COMMERCIAL_TYPE_LAND;
                    break;
            }

            object.commercialArea         = refinedItem.squareTotal;
            object.agentFee            = refinedItem.agentCommission;

            if (refinedItem.rentDeposit) {
                object.rentPledge = true;
            }
        }

        //==========================================================


        function convertToBoolean(myField, item) {
            if (+item === 1) {
                object[myField] = true;
            }
        }

        return object;
    }

    /** Create user of return from database */
    findUserOrCreate(userInfo, callback) {

        this.userModel.model.findOne({
            phone: this.userModel.formatPhone(userInfo.phone)
        }, (err, user) => {
            if (err) return callback(err);

            if (user) {
                return callback(null, user, false);
            }

            delete userInfo.image;

            let userData = {};
            userData.firstName = userInfo.name;
            userData.phone = userInfo.phone;

            if (+userInfo.type === 1) {
                userData.isAgent = true;
            }

            user = new this.userModel.model(userData);

            //user.feed = this.importFeed.id;

            user.save((err, user) => {

                callback(err, user, true);
            });
        });

    }

    /** Get images for object (create new image if not found) */
    getImages(object, imagesUrls, callback) {

        let images      = [];
        let knownImages = [];

        imagesUrls = imagesUrls.slice(0, MAX_NR_OF_IMAGES_PER_OBJECT);

        async.series([callback => {

            if (object.images.length === 0) return callback(); // object has not images so far

            this.imageModel.model.find({_id: {$in: object.images}}, (err, images) => {

                if (err) callback(err);

                knownImages = images;

                callback();
            });

        }, callback => {

            async.eachLimit(imagesUrls, MAX_NR_OF_IMAGES_TO_HANDLE_PER_TIME, (imageUrl, callback) => {

                let knownImage;

                // why _.find fails here???
                knownImages.forEach(img => {
                    if (img.sourceUrl === imageUrl) {
                        knownImage = img;
                    }
                });

                if (knownImage) {

                    //this.statistics.images.found++;

                    images.push(knownImage);

                    return callback();
                }

                // Image not found, let's download
                this.imageModel.uploadObjectImage({url: imageUrl, optimizeLocally: true}, (err, image) => {
                    if (err) {
                        // ignore error here
                        //this.statistics.images.errored++;
                        return callback();
                    }

                    //this.statistics.images.downloaded++;

                    images.push(image);

                    callback();
                });

            }, err => {

                callback(err);
            });

        }], err => {

            if (err) this.logger.error(err);

            callback(null, images);
        });
    }

    /** Update images */
    updateImages(object, images, callback) {

        async.series([callback => {

            // 1. Remove images

            const imagesIds = images.map(image => {
                return image.id
            });

            let imagesIdsToRemove = [];

            object.images.forEach(imageId => {
                if (imagesIds.indexOf(imageId.toString()) === -1) {
                    imagesIdsToRemove.push(imageId.toString());
                }
            });

            if (imagesIdsToRemove.length > 0) {
                this.logger.debug('Destroy images: ' + require('util').inspect(imagesIdsToRemove));

                //this.statistics.images.removed += imagesIdsToRemove.length;
            }

            async.eachLimit(imagesIdsToRemove, MAX_NR_OF_IMAGES_TO_DELETE_PER_TIME, (imageIdToRemove, callback) => {

                this.imageModel.findById(imageIdToRemove, (err, image) => {
                    if (err) return callback(err);
                    if (!image) {
                        this.logger.warn('Importer::updateImages: Image not found by ID: ' + imageIdToRemove);
                        return callback();
                    }

                    image.remove(callback);
                });
            }, err => {

                callback(err);
            });

        }, callback => {

            // 2. Update/Add images

            async.eachLimit(images, 10, (image, callback) => {

                if (!image.object) {

                    // TODO: @future А что если дубликат?
                    image.object = object.id;

                    image.save(callback);

                } else {

                    callback();
                }

            }, err => {

                callback(err);
            });

        }], callback);
    }
}

/**
 * Exporting Model
 *
 * @type {Function}
 */
module.exports = Importer;
