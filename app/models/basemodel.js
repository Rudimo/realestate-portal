'use strict';

/**
 * Requiring Core Library
 */
const Core = require('nodejs-lib');

/**
 * Application constants
 * @type {*|exports|module.exports}
 */
const c = require('../constants');

/**
 *  Base model
 */
class BaseModel extends Core.MongooseModel {
    /**
     * Model constructor
     */
    constructor(listName) {
        // We must call super() in child class to have access to 'this' in a constructor
        super(listName);

        /**
         * pkgClient
         *
         * @type {null}
         * @private
         */
        this._pkgClient = null;

        try {
            var currentModel = this.model;
            console.log('Create: ' + listName);
        } catch (err) {

            if ('OverwriteModelError' === err.name) {
                return this._logger.log('Model %s is already defined', this._list);
            }

            if ('MissingSchemaError' !== err.name) {
                throw err;
            }

            // Defining current schema
            this.defineSchema();


        }
    }

    /**
     * Register mongoose hooks
     *
     * @override
     */
    registerHooks() {

        var $this = this;

        if (typeof this._schema.paths.idNumber !== 'undefined') {

            // Add pre save hook for numeric id's
            this._schema.pre('save', function (next) {

                if (!this.isNew || this.idNumber) return next(); // Only for new items

                $this.getNextId((err, nextId) => {
                    if (err) {
                        $this.logger.error(err);
                        return next(err);
                    }

                    this.idNumber = nextId;
                    next();
                });
            });
        }

        /**
         * Save old item to trace
         */
        this._schema.pre('save', function (next) {

            if (this.isNew) {
                return next();
            }

            $this.model.findById(this._id, function (err, item) {
                if (err) return next(err);
                if (!item) return next(new Error('Item was not found by ' + this._id));

                this.oldItem = item.toObject();
                next();

            }.bind(this));
        });

    }

    /**
     * pkgClient getter
     *
     * @returns {null|*}
     */
    get pkgClient() {
        if (!this._pkgClient) {
            this._pkgClient = new Core.PkgClient();
        }

        return this._pkgClient;
    }

    /**
     * Obtain next idNumber for collection item
     *
     * @param callback
     */
    getNextId(callback) {

        /**
         * Counter model
         */
        let CounterModel = require('nodejs-admin').Admin.Models.Counters;

        CounterModel.getNextSequence(this.listName, (err, nextId) => {
            if (err) {
                this.logger.error(err);
                return callback(err);
            }

            callback(null, nextId);
        });
    }

    /**
     * Define Schema. Must be overwritten in descendants.
     *
     * @abstract
     */
    defineSchema() {

    }

    /**
     * Get MEGA compound object type
     *
     * @param objectInfo
     * @returns {*}
     */
    getMegaCompoundType(objectInfo) {
        if (+objectInfo.offerType == c.RZ_OFFER_TYPE_SALE) {
            switch (+objectInfo.objectType) {
                case c.RZ_OBJECT_TYPE_FLAT:
                    if (objectInfo.rooms) {
                        if (+objectInfo.rooms === 1) {
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_1_ROOM_SALE;
                        } else if (+objectInfo.rooms === 2) {
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_2_ROOM_SALE;
                        } else if (+objectInfo.rooms === 3) {
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_3_ROOM_SALE;
                        } else if (+objectInfo.rooms === 4) {
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_4_ROOM_SALE;
                        } else if (+objectInfo.rooms === 5) {
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_5_ROOM_SALE;
                        } else if (+objectInfo.rooms === 6) {
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_STUDIO_ROOM_SALE;
                        } else if (+objectInfo.rooms === 7) {
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_OPEN_ROOM_SALE;
                        }
                    }
                    break;
                case c.RZ_OBJECT_TYPE_ROOM:
                    return c.RZ_MEGA_CMP_OBJECT_TYPE_ROOM_SALE;
                case c.RZ_OBJECT_TYPE_HOUSE:
                    switch (+objectInfo.houseType) {
                        case c.RZ_HOUSE_TYPE_HOUSE:
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_HOUSE_SALE;
                        case c.RZ_HOUSE_TYPE_COTTAGE:
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_HOUSE_COTTAGE_SALE;
                        case c.RZ_HOUSE_TYPE_DACHA:
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_HOUSE_DACHA_SALE;
                        case c.RZ_HOUSE_TYPE_TOWNHOUSE:
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_HOUSE_TOWNHOUSE_SALE;
                        case c.RZ_HOUSE_TYPE_HALF_HOUSE:
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_HOUSE_HALF_HOUSE_SALE;
                    }
                    break;
                case c.RZ_OBJECT_TYPE_LAND:
                    switch (+objectInfo.lotType) {
                        case c.RZ_LOT_TYPE_IGS:
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_LOT_IGS_SALE;
                        case c.RZ_LOT_TYPE_GARDEN:
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_LOT_GARDEN_SALE;
                        case c.RZ_LOT_TYPE_FARM:
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_LOT_FARM_SALE;
                    }
                    break;
                case c.RZ_OBJECT_TYPE_GARAGE:
                    switch (+objectInfo.garageType) {
                        case c.RZ_GARAGE_TYPE_GARAGE:
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_GARAGE_SALE;
                        case c.RZ_GARAGE_TYPE_PARKING_PLACE:
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_GARAGE_PARKING_PLACE_SALE;
                        case c.RZ_GARAGE_TYPE_BOX:
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_GARAGE_BOX_SALE;
                    }
                    break;
                case c.RZ_OBJECT_TYPE_COMMERCIAL:
                    switch (+objectInfo.commercialType) {
                        case c.RZ_COMMERCIAL_TYPE_OFFICE:
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_OFFICE_SALE;
                        case c.RZ_COMMERCIAL_TYPE_RETAIL:
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_RETAIL_SALE;
                        case c.RZ_COMMERCIAL_TYPE_FREE_PURPOSE:
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_FREE_PURPOSE_SALE;
                        case c.RZ_COMMERCIAL_TYPE_PUBLIC_CATERING:
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_PUBLIC_CATERING_SALE;
                        case c.RZ_COMMERCIAL_TYPE_AUTO_REPAIR:
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_AUTO_REPAIR_SALE;
                        case c.RZ_COMMERCIAL_TYPE_BUSINESS:
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_BUSINESS_SALE;
                        case c.RZ_COMMERCIAL_TYPE_LAND:
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_LAND_SALE;
                        case c.RZ_COMMERCIAL_TYPE_HOTEL:
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_HOTEL_SALE;
                        case c.RZ_COMMERCIAL_TYPE_WAREHOUSE:
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_WAREHOUSE_SALE;
                        case c.RZ_COMMERCIAL_TYPE_MANUFACTURING:
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_MANUFACTURING_SALE;
                    }
            }
        } else {
            switch (+objectInfo.objectType) {
                case c.RZ_OBJECT_TYPE_FLAT:
                    if (objectInfo.rooms) {
                        if (+objectInfo.rooms === 1) {
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_1_ROOM_RENT;
                        } else if (+objectInfo.rooms === 2) {
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_2_ROOM_RENT;
                        } else if (+objectInfo.rooms === 3) {
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_3_ROOM_RENT;
                        } else if (+objectInfo.rooms === 4) {
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_4_ROOM_RENT;
                        } else if (+objectInfo.rooms === 5) {
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_5_ROOM_RENT;
                        } else if (+objectInfo.rooms === 6) {
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_STUDIO_ROOM_RENT;
                        } else if (+objectInfo.rooms === 7) {
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_OPEN_ROOM_RENT;
                        }
                    }
                    break;
                case c.RZ_OBJECT_TYPE_ROOM:
                    return c.RZ_MEGA_CMP_OBJECT_TYPE_ROOM_RENT;
                case c.RZ_OBJECT_TYPE_HOUSE:
                    switch (+objectInfo.houseType) {
                        case c.RZ_HOUSE_TYPE_HOUSE:
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_HOUSE_RENT;
                        case c.RZ_HOUSE_TYPE_COTTAGE:
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_HOUSE_COTTAGE_RENT;
                        case c.RZ_HOUSE_TYPE_DACHA:
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_HOUSE_DACHA_RENT;
                        case c.RZ_HOUSE_TYPE_TOWNHOUSE:
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_HOUSE_TOWNHOUSE_RENT;
                        case c.RZ_HOUSE_TYPE_HALF_HOUSE:
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_HOUSE_HALF_HOUSE_RENT;
                    }
                    break;
                case c.RZ_OBJECT_TYPE_GARAGE:
                    switch (+objectInfo.garageType) {
                        case c.RZ_GARAGE_TYPE_GARAGE:
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_GARAGE_RENT;
                        case c.RZ_GARAGE_TYPE_PARKING_PLACE:
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_GARAGE_PARKING_PLACE_RENT;
                        case c.RZ_GARAGE_TYPE_BOX:
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_GARAGE_BOX_RENT;
                    }
                    break;
                case c.RZ_OBJECT_TYPE_COMMERCIAL:
                    switch (+objectInfo.commercialType) {
                        case c.RZ_COMMERCIAL_TYPE_OFFICE:
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_OFFICE_RENT;
                        case c.RZ_COMMERCIAL_TYPE_RETAIL:
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_RETAIL_RENT;
                        case c.RZ_COMMERCIAL_TYPE_FREE_PURPOSE:
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_FREE_PURPOSE_RENT;
                        case c.RZ_COMMERCIAL_TYPE_PUBLIC_CATERING:
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_PUBLIC_CATERING_RENT;
                        case c.RZ_COMMERCIAL_TYPE_AUTO_REPAIR:
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_AUTO_REPAIR_RENT;
                        case c.RZ_COMMERCIAL_TYPE_BUSINESS:
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_BUSINESS_RENT;
                        case c.RZ_COMMERCIAL_TYPE_LEGAL_ADDRESS:
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_LEGAL_ADDRESS_RENT;
                        case c.RZ_COMMERCIAL_TYPE_LAND:
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_LAND_RENT;
                        case c.RZ_COMMERCIAL_TYPE_HOTEL:
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_HOTEL_RENT;
                        case c.RZ_COMMERCIAL_TYPE_WAREHOUSE:
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_WAREHOUSE_RENT;
                        case c.RZ_COMMERCIAL_TYPE_MANUFACTURING:
                            return c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_MANUFACTURING_RENT;
                    }
            }
        }

        this.logger.info('BaseModel: Can\'t get mega compound object type. objectType = ' +
            objectInfo.objectType + ', offerType = ' + objectInfo.offerType);
    }

    /**
     * Resave all items
     *
     * @param callback
     */
    resaveAll(callback) {

        this.iterate({}, (item, callback) => {

            item.save(callback);

        }, callback, callback);
    }
}

/**
 * Exporting Model
 *
 * @type {Function}
 */
module.exports = BaseModel;
