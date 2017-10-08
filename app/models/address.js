'use strict';

/**
 * Requiring Core Library
 */
const Core = require('nodejs-lib');

/**
 * Requiring base Model
 */
const BaseModel = require('./basemodel.js');

/**
 * MD5 calculation library
 *
 * @type {*|exports|module.exports}
 */
const md5 = require('md5');

/**
 * Yandex Geocoder module
 *
 * @type {*|exports|module.exports}
 */
const YandexGeocoder = require('nodejs-yandex-geocoder');

/**
 * Request module
 * @type {request|exports|module.exports}
 */
const request = require('request');

/**
 * Async library
 *
 * @type {async|exports|module.exports}
 */
const async = require('async');

/**
 * Geo library
 *
 * @type {geolib|exports|module.exports}
 */
const geolib = require('geolib');

/**
 *  Address cache model class
 */
class AddressesModel extends BaseModel {
    /**
     * Model constructor
     */
    constructor(listName) {
        // We must call super() in child class to have access to 'this' in a constructor
        super(listName);
    }

    /**
     * Define Schema
     *
     * @override
     */
    defineSchema() {

        let schemaObject = {

            hash: {type: String, index: true, unique: true},

            addresses: [{
                longitude: Number,
                latitude: Number,
                obl: String,
                raion: String,
                place: String,
                cityRaion: String,
                metro: String,
                distance: Number,
                street: String,
                house: String
            }],

            hits: {type: Number, default: 0},
            lastAccess: {type: Date, expires: '30d', default: Date.now}
        };

        // Creating DBO Schema
        let OrganizationSchema = this.createSchema(schemaObject);

        // Registering schema and initializing model
        this.registerSchema(OrganizationSchema);
    }

    /**
     * Validating item before save
     *
     * @param item
     * @param validationCallback
     * @returns {array}
     */
    validate(item, validationCallback) {
        let validationMessages = [];


        validationCallback(Core.ValidationError.create(validationMessages));
    }

    /**
     * Do not index this collection
     *
     * @override
     * @param callback
     */
    defineMapping(callback) {
        if (callback) callback();
    }

    /**
     * Resolve address
     *
     * @param query
     * @param query.q
     * @param query.kind
     * @param callback
     */
    resolveAddress(query, callback) {

        let hash = md5(JSON.stringify(query));

        modelInstance.model.findOne({hash: hash}, (err, address) => {
            if (err) return callback(err);

            if (address) {

                callback(null, this.refineCollection(address.addresses));

                address.hits++;
                address.lastAccess = new Date();
                address.save(err => {
                    if (err) this.logger.error(err);
                });

            } else {

                let geocoder = new YandexGeocoder({
                    apiKey: Core.ApplicationFacade.instance.config.env.YANDEX_MAP_API_KEY,
                    russianAddressesOnly: true
                });

                geocoder.resolve(query.q, {kind: query.kind}, (err, collection) => {

                    if (err) {
                        this.logger.debug(err);
                        return callback(new Error('Неудалось распознать адрес'));
                    }

                    let addressInstance = new modelInstance.model({
                        hash: hash,
                        addresses: collection
                    });

                    addressInstance.save(err => {
                        if (err) return callback(err);

                        callback(null, this.refineCollection(collection));
                    });
                });
            }
        });
    }

    /**
     * Resolve one address
     *
     * @param addressSearchString
     * @param callback
     */
    resolveOneAddress(addressSearchString, callback) {

        let hash = md5(addressSearchString + '-full-address');

        modelInstance.model.findOne({hash: hash}, (err, address) => {
            if (err) return callback(err);

            if (address) {

                callback(null, this.refineAddress(address.addresses[0]));

                address.hits++;
                address.lastAccess = new Date();
                address.save(err => {
                    if (err) this.logger.error(err);
                });

            } else {

                let geocoder = new YandexGeocoder({
                    apiKey: Core.ApplicationFacade.instance.config.env.YANDEX_MAP_API_KEY,
                    russianAddressesOnly: true
                });

                async.waterfall([callback => {

                    geocoder.resolve(addressSearchString, {results: 1, timeout: 5000}, (err, collection) => {

                        if (err) {
                            this.logger.debug(err);
                            return callback(new Error('Неудалось распознать адрес: "' + addressSearchString + '"'));
                        }

                        if (collection.length == 0) {
                            return callback(new Error('Неудалось распознать адрес: "' + addressSearchString + '"'));
                        }

                        callback(null, collection);
                    });

                }, (collection, callback) => {

                    this.resolveCityRaion({
                        longitude: collection[0].longitude,
                        latitude: collection[0].latitude
                    }, (err, cityRaion) => {
                        if (err) {
                            this.logger.debug(err);
                            return callback(new Error('Неудалось распознать адрес (район города)'));
                        }

                        collection[0].cityRaion = cityRaion;

                        callback(null, collection);
                    });

                }, (collection, callback) => {

                    /**
                     * Метро есть только в:
                     *
                     * Москва, Санкт-Петербург
                     * Нижний Новгород, Новосибирск, Самара, Екатеринбург, Казань, Волгоград, Омск, Челябинск, Красноярск
                     */
                    if (['Москва', 'Санкт-Петербург'].indexOf(collection[0].obl) === -1) {

                        let raion = collection[0].raion;

                        if (raion) {
                            raion = raion.replace(/^(городской округ) (.*)$/, '$2');
                        }

                        if (['Нижний Новгород', 'Новосибирск', 'Самара', 'Екатеринбург', 'Казань'].indexOf(raion) === -1) {

                            //this.logger.debug('Do not resolve metro for "' + raion + '"');
                            return callback(null, collection);
                        }
                    }

                    this.resolveMetro({
                        longitude: collection[0].longitude,
                        latitude: collection[0].latitude
                    }, (err, data) => {
                        if (err) {
                            this.logger.debug(err);
                            return callback(new Error('Неудалось распознать адрес (метро)'));
                        }

                        collection[0].metro    = data.name;
                        collection[0].distance = data.distance;

                        callback(null, collection);
                    });

                }], (err, collection) => {

                    if (err) {
                        this.logger.debug(err);
                        return callback(new Error('Неудалось распознать адрес'));
                    }

                    let addressInstance = new modelInstance.model({
                        hash: hash,
                        addresses: collection
                    });

                    addressInstance.save(err => {
                        if (err) return callback(err);

                        callback(null, this.refineAddress(collection[0]));
                    });
                });
            }
        });
    }

    /**
     * Get city raion name by coordinates
     *
     * @param options
     * @param options.longitude
     * @param options.latitude
     * @param callback
     */
    resolveCityRaion(options, callback) {

        let requestUrl = `http://geocode-maps.yandex.ru/1.x/?geocode=${options.longitude},${options.latitude}&results=1&format=json&kind=district&key=${Core.ApplicationFacade.instance.config.env.YANDEX_MAP_API_KEY}`;

        request.get({
            url: requestUrl,
            json: true,
            timeout: 5000
        }, (err, response, body) => {

            let collection = [];

            if (err) {
                return callback(err);
            }

            if (!body) {
                return callback(null, collection);
            }

            if (body.error) {
                return callback(new Error(body.error.message));
            }

            let featureMember = body.response.GeoObjectCollection.featureMember;
            let cityRaion;

            if (featureMember.length > 0) {
                cityRaion = featureMember.pop().GeoObject.name
            }

            return callback(null, cityRaion);
        });
    }

    /**
     * Get metro name & distance by coordinates
     *
     * Москва, Санкт-Петербург, Нижний Новгород, Новосибирск, Самара, Екатеринбург, Казань,
     * Волгоград, Омск, Челябинск, Красноярск
     *
     * @param options
     * @param options.longitude
     * @param options.latitude
     * @param callback
     */
    resolveMetro(options, callback) {

        let requestUrl = `http://geocode-maps.yandex.ru/1.x/?geocode=${options.longitude},${options.latitude}&results=1&format=json&kind=metro&key=${Core.ApplicationFacade.instance.config.env.YANDEX_MAP_API_KEY}`;

        request.get({
            url: requestUrl,
            json: true,
            timeout: 5000
        }, (err, response, body) => {

            let collection = [];

            if (err) {
                return callback(err);
            }

            if (!body) {
                return callback(null, collection);
            }

            if (body.error) {
                return callback(new Error(body.error.message));
            }

            let featureMember = body.response.GeoObjectCollection.featureMember;
            let name;
            let distance;

            if (featureMember.length > 0) {
                let geoObject = featureMember.pop().GeoObject;
                let longitude = geoObject.Point.pos.split(' ')[0];
                let latitude  = geoObject.Point.pos.split(' ')[1];

                distance = Math.round(geolib.getDistance({
                    latitude: options.latitude,
                    longitude: options.longitude
                }, {
                    latitude: latitude,
                    longitude: longitude
                }));

                //console.log(`${options.latitude} ${options.longitude} - ${latitude} ${longitude}`);
                //console.log(distance);

                name = geoObject.name.replace(/метро /, '');
            }

            return callback(null, {name: name, distance: distance});
        });
    }

    /**
     * Refine collection
     *
     * TODO: Resolve geoMetro
     *
     * @param address
     * @param address.obl
     * @param address.longitude
     * @param address.latitude
     * @param address.raion
     * @param address.place
     * @param address.cityRaion
     * @param address.metro
     * @param address.distance
     * @param address.street
     * @param address.house
     *
     * @param address.address
     *
     * @returns {*}
     */
    refineAddress(address) {

        let refinedItem = {};

        if (address.obl === 'Республика Северная Осетия — Алания') { // fix geo obl

            address.obl = 'Республика Северная Осетия-Алания';
        }

        /**
         * Удалим Район если это городской округ и совпадает с населенным пунктом
         */
        if (address.raion === 'городской округ ' + address.place) {
            address.raion = address.place;
            address.place = undefined;
        }

        if (address.raion) {
            // Удалим 'городской округ', 'город'
            //address.raion = address.raion.replace(/^(городской округ) (.*)$/, '$2 ($1)');
            address.raion = address.raion.replace(/^(городской округ) (.*)$/, '$2');
            address.raion = address.raion.replace(/^(город) (.*)$/i, '$2');
        }

        /**
         * Удалим дублирующий район для города
         */
        if (address.place == address.cityRaion) {
            address.cityRaion = undefined;
        }

        if (address.place) {
            address.place = address.place.replace(/^(деревня) (.*)$/, '$2 ($1)');
            address.place = address.place.replace(/^(посёлок городского типа имени) (.*)$/, '$2 (поселок)');
            address.place = address.place.replace(/^(поселок городского типа имени) (.*)$/, '$2 (поселок)');
            address.place = address.place.replace(/^(посёлок городского типа) (.*)$/, '$2 (поселок)');
            address.place = address.place.replace(/^(поселок городского типа) (.*)$/, '$2 (поселок)');
            address.place = address.place.replace(/^(СНТ) (.*)$/, '$2 ($1)');
            address.place = address.place.replace(/^(село) (.*)$/, '$2 ($1)');
        }

        if (address.cityRaion) {
            address.cityRaion = address.cityRaion.replace(/^(микрорайон) (.*)$/, '$2 ($1)');
            address.cityRaion = address.cityRaion.replace(/^(жилой комплекс) (.*)$/, '$2 ($1)');
        }

        /**
         * Rebuild address
         */
        let addressArr = [address.obl];

        if (address.raion) {
            addressArr.push(address.raion);
        }

        if (address.place && address.place !== address.raion) {
            addressArr.push(address.place);
        }

        if (address.street) {
            addressArr.push(address.street);
        }

        if (address.house) {
            addressArr.push(address.house);
        }

        address.address = addressArr.join(', ');

        // Backward compatibility
        refinedItem.geoAddress   = address.address;
        refinedItem.geoLongitude = address.longitude;
        refinedItem.geoLatitude  = address.latitude;
        refinedItem.geoObl       = address.obl;
        refinedItem.geoRaion     = address.raion || undefined;
        refinedItem.geoPlace     = address.place || undefined;
        refinedItem.geoCityRaion = address.cityRaion || undefined;
        refinedItem.geoMetro     = address.metro || undefined;
        refinedItem.geoDistance  = address.distance || undefined;
        refinedItem.geoStreet    = address.street || undefined;
        refinedItem.geoHouse     = address.house || undefined;

        return refinedItem;
    }

    /**
     * Refine collection of addresses
     *
     * @param collection
     * @returns {*}
     */
    refineCollection(collection) {

        collection = collection.map(item => {
            return this.refineAddress(item);
        });

        return collection;
    }
}

/**
 * Creating instance of the model
 */
let modelInstance = new AddressesModel('address');

/**
 * Exporting Model
 *
 * @type {Function}
 */
module.exports = modelInstance;