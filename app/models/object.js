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
 * Application constants
 * @type {*|exports|module.exports}
 */
const c = require('../constants');

/**
 * Async library
 *
 * @type {async|exports|module.exports}
 */
const async = require('async');

/**
 * String validator
 *
 * @type {*|exports|module.exports}
 */
const validator = require('validator');

/**
 * Library for generating a slug
 * @type {*|exports|module.exports}
 */
const speakingUrl = require('speakingurl');

/**
 * MD5 generation module
 *
 * @type {function|exports|module.exports}
 */
const md5 = require('md5');

/**
 * Lodash library
 *
 * @type {_|exports|module.exports}
 * @private
 */
const _ = require('lodash');

/**
 * Moment library
 */
const moment = require('moment');

/**
 * PHP strip_tags in Node.js
 *
 * @type {*}
 */
const stripTags = require('striptags');

/**
 * All regions
 *
 * @type {Array}
 */
const regions = require('../data/region');

/**
 * All region names
 *
 * @type {Array}
 */
const regionNames = require('../data/region-names');

/**
 * All cities
 *
 * @type {Array}
 */
const cities = require('../data/cities');

/**
 * Offer type map
 */
const offerTypeMap = require('../constants/maps/offer-type-map');

/**
 * Object type map
 */
const objectTypeMap = require('../constants/maps/object-type-map');

/**
 * Rooms type map
 */
const roomsMap = require('../constants/maps/rooms-map');

/**
 * Buildings type map
 */
const buildingsMap = require('../constants/maps/buildings-map');

/**
 * Commercial type map
 */
const commercialMap = require('../constants/maps/commercial-map');

/**
 * Garage type map
 */
const garagesMap = require('../constants/maps/garages-map');

/**
 * Land type map
 */
const landsMap = require('../constants/maps/lands-map');

const viewFilters = require('../libs/view-filters');

/**
 *  Client model class
 */
class ObjectModel extends BaseModel {
    /**
     * Model constructor
     */
    constructor(listName) {
        // We must call super() in child class to have access to 'this' in a constructor
        super(listName);

        /**
         * Params specification
         *
         * @type {*[]}
         * @private
         */
        this._paramsMap = [{
            fieldName: 'title',
            name: 'Заголовок объявления',
            maxlength: 128,
            inlineError: 'Максимальная длина 128 символов включая пробелы'
        }, {
            fieldName: 'floor',
            name: 'Этаж',
            pattern: '/^\-?[0-9]{1,3}$/',
            inlineError: 'Число от -5 до 100.'
        }, {
            fieldName: 'floors',
            name: 'Этажность',
            pattern: '/^[0-9]{1,3}$/',
            inlineError: 'Число от 1 до 100.'
        }, {
            fieldName: 'ceilingHeight',
            name: 'Высота потолков',
            pattern: '/^[0-9]{1}((\.|\,)[0-9]{1,2}){0,1}$/',
            inlineError: 'Число, например: 2.75'
        }, {
            fieldName: 'squareTotal',
            name: 'Общая площадь',
            pattern: '/^[0-9]{1,6}((\.|\,)[0-9]{1,2}){0,1}$/',
            inlineError: 'Число от 1 до 1000'
        }, {
            fieldName: 'squareLiving',
            name: 'Жилая площадь',
            pattern: '/^[0-9]{1,6}((\.|\,)[0-9]{1,2}){0,1}$/',
            inlineError: 'Число от 1 до 1000'
        }, {
            fieldName: 'squareKitchen',
            name: 'Площадь кухни',
            pattern: '/^[0-9]{1,6}((\.|\,)[0-9]{1,2}){0,1}$/',
            inlineError: 'Число от 1 до 1000'
        }, {
            fieldName: 'squareLand',
            name: 'Площадь участка (сот)',
            pattern: '/^[0-9]{1,9}((\.|\,)[0-9]{1,2}){0,1}$/',
            inlineError: 'Число, например: 12.5'
        }, {
            fieldName: 'squareRooms',
            name: 'Площадь комнат',
            pattern: '/^[0-9]{1,3}((\.|\,)[0-9]{1,2}){0,1}$/',
            inlineError: 'Число, например: 24.5'
        }, {
            fieldName: 'houseArea',
            name: 'Площадь дома',
            pattern: '/^[0-9]{1,3}((\.|\,)[0-9]{1,2}){0,1}$/',
            inlineError: 'Число, например: 24.5'
        }, {
            fieldName: 'houseFloors',
            name: 'Количество этажей',
            pattern: '/^[0-9]{1,2}$/',
            inlineError: 'Число, например: 2'
        }, {
            fieldName: 'yearBuild',
            name: 'Год постройки',
            pattern: '/^[0-9]{4}$/',
            inlineError: 'Укажите в формате: YYYY'
        }, {
            fieldName: 'prepayment',
            name: 'Предоплата',
            pattern: '/^[0-9]{1,4}$/',
            inlineError: 'Число от 0 до 9999'
        }, {
            fieldName: 'agentFee',
            name: 'Комиссия агента',
            pattern: '/^[0-9]{1,4}$/',
            inlineError: 'Число от 0 до 9999'
        }, {
            fieldName: 'securityPayment',
            name: 'Обеспечительный платеж',
            pattern: '/^[0-9]{1,4}$/',
            inlineError: 'Число от 0 до 9999'
        }, {
            fieldName: 'dealStatus',
            name: 'Тип сделки',
            allowedValues: [{
                label: 'Прямая аренда',
                value: c.RZ_DEAL_STATUS_DIRECT_RENT
            }, {
                label: 'Субаренда',
                value: c.RZ_DEAL_STATUS_SUB_RENT
            }, {
                label: 'Продажа права аренды',
                value: c.RZ_DEAL_STATUS_SALE_OF_LEASE_RIGHTS
            }]
        }, {
            fieldName: 'houseType',
            name: 'Тип дома',
            allowedValues: [{
                label: 'Дом',
                value: c.RZ_HOUSE_TYPE_HOUSE
            }, {
                label: 'Коттедж',
                value: c.RZ_HOUSE_TYPE_COTTAGE
            }, {
                label: 'Дача',
                value: c.RZ_HOUSE_TYPE_DACHA
            }, {
                label: 'Таунхаус',
                value: c.RZ_HOUSE_TYPE_TOWNHOUSE
            }, {
                label: 'Часть дома',
                value: c.RZ_HOUSE_TYPE_HALF_HOUSE
            }]
        }, {
            fieldName: 'taxationForm',
            name: 'Форма налогобложения',
            allowedValues: [{
                label: 'НДС',
                value: c.RZ_LOT_TYPE_IGS
            }, {
                label: 'УСН',
                value: c.RZ_LOT_TYPE_GARDEN
            }]
        }, {
            fieldName: 'lotType',
            name: 'Тип участка',
            allowedValues: [{
                label: 'ИЖС',
                value: c.RZ_LOT_TYPE_IGS
            }, {
                label: 'В садоводстве',
                value: c.RZ_LOT_TYPE_GARDEN
            }, {
                label: 'Фермерский',
                value: c.RZ_LOT_TYPE_FARM
            }]
        }, {
            fieldName: 'shower',
            name: 'Душ',
            allowedValues: [{
                label: 'В доме',
                value: c.RZ_SHOWER_TYPE_INSIDE
            }, {
                label: 'На улице',
                value: c.RZ_SHOWER_TYPE_OUTSIDE
            }, {
                label: 'Отсутствует',
                value: c.RZ_SHOWER_TYPE_NONE
            }]
        }, {
            fieldName: 'toilet',
            name: 'Туалет',
            allowedValues: [{
                label: 'В доме',
                value: c.RZ_TOILET_TYPE_INSIDE
            }, {
                label: 'На улице',
                value: c.RZ_TOILET_TYPE_OUTSIDE
            }, {
                label: 'Отсутствует',
                value: c.RZ_TOILET_TYPE_NONE
            }]
        }, {
            fieldName: 'objectType',
            name: 'Тип недвижимости',
            allowedValues: [{
                label: 'Квартира',
                value: c.RZ_OBJECT_TYPE_FLAT
            }, {
                label: 'Комната',
                value: c.RZ_OBJECT_TYPE_ROOM
            }, {
                label: 'Дом',
                value: c.RZ_OBJECT_TYPE_HOUSE
            }, {
                label: 'Земля',
                value: c.RZ_OBJECT_TYPE_LAND
            }, {
                label: 'Гараж',
                value: c.RZ_OBJECT_TYPE_GARAGE
            }, {
                label: 'Коммерческая',
                value: c.RZ_OBJECT_TYPE_COMMERCIAL
            }]
        }, {
            fieldName: 'offerType',
            name: 'Тип сделки',
            allowedValues: [{
                label: 'Продажа',
                value: c.RZ_OFFER_TYPE_SALE
            }, {
                label: 'Аренда',
                value: c.RZ_OFFER_TYPE_RENT
            }]
        }, {
            fieldName: 'buildingType',
            name: 'Тип дома',
            allowedValues: [{
                label: 'Панельный',
                value: c.RZ_BUILDING_TYPE_PANEL
            }, {
                label: 'Кирпичный',
                value: c.RZ_BUILDING_TYPE_BRICK
            }, {
                label: 'Монолитный',
                value: c.RZ_BUILDING_TYPE_MONOLITHIC
            }]
        }, {
            fieldName: 'parkingType',
            name: 'Тип парковки',
            allowedValues: [{
                label: 'Стихийная парковка',
                value: c.RZ_PARKING_TYPE_SPONTANEOUS
            }, {
                label: 'Охраняемая',
                value: c.RZ_PARKING_TYPE_SECURE
            }, {
                label: 'Неохраняемая',
                value: c.RZ_PARKING_TYPE_UNSECURE
            }, {
                label: 'Подземная',
                value: c.RZ_PARKING_TYPE_UNDERGROUND
            }]
        }, {
            fieldName: 'rooms',
            name: 'Комнат в квартире',
            allowedValues: [{
                label: '1',
                value: c.RZ_ROOMS_TYPE_ONE
            }, {
                label: '2',
                value: c.RZ_ROOMS_TYPE_TWO
            }, {
                label: '3',
                value: c.RZ_ROOMS_TYPE_THREE
            }, {
                label: '4',
                value: c.RZ_ROOMS_TYPE_FOUR
            }, {
                label: '5',
                value: c.RZ_ROOMS_TYPE_FIVE
            }, {
                label: 'Студия',
                value: c.RZ_ROOMS_TYPE_STUDIO
            }, {
                label: 'Свободная планировка',
                value: c.RZ_ROOMS_TYPE_OPEN
            }]
        }, {
            fieldName: 'balcony',
            name: 'Балкон',
            allowedValues: [{
                label: 'Нет',
                value: c.RZ_BALCONY_TYPE_NONE
            }, {
                label: 'Балкон',
                value: c.RZ_BALCONY_TYPE_BALCONY
            }, {
                label: 'Лоджия',
                value: c.RZ_BALCONY_TYPE_LOGGIA
            }]
        }, {
            fieldName: 'bathroom',
            name: 'Санузел',
            allowedValues: [{
                label: 'Совмещенный',
                value: c.RZ_BATHROOM_TYPE_MATCHED
            }, {
                label: 'Раздельный',
                value: c.RZ_BATHROOM_TYPE_SEPARATED
            }, {
                label: '2',
                value: c.RZ_BATHROOM_TYPE_TWO
            }, {
                label: '3',
                value: c.RZ_BATHROOM_TYPE_THREE
            }, {
                label: '4+',
                value: c.RZ_BATHROOM_TYPE_FOUR_OR_MORE
            }]
        }, {
            fieldName: 'covering',
            name: 'Покрытие пола',
            allowedValues: [{
                label: 'Ковролин',
                value: c.RZ_FLOOR_COVERING_TYPE_CARPETING
            }, {
                label: 'Ламинат',
                value: c.RZ_FLOOR_COVERING_TYPE_LAMINATE
            }, {
                label: 'Линолеум',
                value: c.RZ_FLOOR_COVERING_TYPE_LINOLEUM
            }, {
                label: 'Паркет',
                value: c.RZ_FLOOR_COVERING_TYPE_PARQUET
            }]
        }, {
            fieldName: 'renovation',
            name: 'Ремонт',
            allowedValues: [{
                label: 'Дизайнерский',
                value: c.RZ_RENOVATION_TYPE_DESIGNER
            }, {
                label: 'Евро',
                value: c.RZ_RENOVATION_TYPE_EURO
            }, {
                label: 'С отделкой',
                value: c.RZ_RENOVATION_TYPE_TRIM
            }, {
                label: 'Требует ремонта',
                value: c.RZ_RENOVATION_TYPE_NEEDS
            }, {
                label: 'Хороший',
                value: c.RZ_RENOVATION_TYPE_GOOD
            }, {
                label: 'Частичный ремонт',
                value: c.RZ_RENOVATION_TYPE_PARTIAL
            }, {
                label: 'Черновая отделка',
                value: c.RZ_RENOVATION_TYPE_ROUGH_FINISH
            }]
        }, {
            // TODO Распредилить по отдельности или нет (правильный ли формат?)
            fieldName: 'cadastralNumber',
            name: 'Кадастровый номер',
            pattern: '/\d{2}:\d{2}:\d{1,7}:\d{1,}/',
            inlineError: 'Кадастровый номер, например: 11:11:1111111:111'
        }, {
            fieldName: 'garageType',
            name: 'Тип',
            allowedValues: [{
                label: 'Машиноместо',
                value: c.RZ_GARAGE_TYPE_PARKING_PLACE
            }, {
                label: 'Гараж',
                value: c.RZ_GARAGE_TYPE_GARAGE
            }, {
                label: 'Бокс',
                value: c.RZ_GARAGE_TYPE_BOX
            }]
        }, {
            fieldName: 'garageGarageType',
            name: 'Тип гаража',
            allowedValues: [{
                label: 'Встроенный',
                value: c.RZ_GARAGE_GARAGE_TYPE_BUILTIN
            }, {
                label: 'Капитальный',
                value: c.RZ_GARAGE_GARAGE_TYPE_CAPITAL
            }, {
                label: 'Ракушка',
                value: c.RZ_GARAGE_GARAGE_TYPE_SHELL
            }, {
                label: 'Самострой',
                value: c.RZ_GARAGE_GARAGE_TYPE_SAMOSTROY
            }]
        }, {
            fieldName: 'garageBoxType',
            name: 'Тип бокса',
            allowedValues: [{
                label: 'Кирпичный',
                value: c.RZ_GARAGE_BOX_TYPE_BRICK
            }, {
                label: 'Металлический',
                value: c.RZ_GARAGE_BOX_TYPE_METAL
            }]
        }, {
            fieldName: 'garageArea',
            name: 'Площадь',
            pattern: '/^[0-9]{1,3}((\.|\,)[0-9]{1,2}){0,1}$/',
            inlineError: 'Число, например: 24.5'
        }, {
            fieldName: 'gsk',
            name: 'ГСК',
            maxlength: 128,
            inlineError: 'Максимальная длина названия ГСК 128 символов включая пробелы'
        }, {
            fieldName: 'garageStatus',
            name: 'Статус',
            allowedValues: [{
                label: 'Кооператив',
                value: c.RZ_GARAGE_STATUS_TYPE_COOPERATIVE
            }, {
                label: 'Собственность',
                value: c.RZ_GARAGE_STATUS_TYPE_OWNERSHIP
            }, {
                label: 'По доверенности',
                value: c.RZ_GARAGE_STATUS_TYPE_BY_PROXY
            }]
        }, {
            fieldName: 'garageParking',
            name: 'Тип парковки',
            allowedValues: [{
                label: 'На крыше',
                value: c.RZ_GARAGE_PARKING_TYPE_ROOF
            }, {
                label: 'Подземная',
                value: c.RZ_GARAGE_PARKING_TYPE_UNDERGROUND
            }, {
                label: 'Наземная',
                value: c.RZ_GARAGE_PARKING_TYPE_GROUND
            }, {
                label: 'Многоуровневая',
                value: c.RZ_GARAGE_PARKING_TYPE_MULTILEVEL
            }, {
                label: 'Открытая',
                value: c.RZ_GARAGE_PARKING_TYPE_OPEN
            }]
        }, {
            fieldName: 'commercialType',
            name: 'Основное назначение',
            allowedValues: [{
                label: 'Офисное помещение',
                value: c.RZ_COMMERCIAL_TYPE_OFFICE
            }, {
                label: 'Торговое помещение',
                value: c.RZ_COMMERCIAL_TYPE_RETAIL
            }, {
                label: 'Помещение свободного назначения',
                value: c.RZ_COMMERCIAL_TYPE_FREE_PURPOSE
            }, {
                label: 'Общепит',
                value: c.RZ_COMMERCIAL_TYPE_PUBLIC_CATERING
            }, {
                label: 'Автосервис',
                value: c.RZ_COMMERCIAL_TYPE_AUTO_REPAIR
            }, {
                label: 'Готовый бизнес',
                value: c.RZ_COMMERCIAL_TYPE_BUSINESS
            }, {
                label: 'Юридический адрес',
                value: c.RZ_COMMERCIAL_TYPE_LEGAL_ADDRESS
            }, {
                label: 'Земельный участок',
                value: c.RZ_COMMERCIAL_TYPE_LAND
            }, {
                label: 'Гостиница',
                value: c.RZ_COMMERCIAL_TYPE_HOTEL
            }, {
                label: 'Складское помещение',
                value: c.RZ_COMMERCIAL_TYPE_WAREHOUSE
            }, {
                label: 'Производственное помещение',
                value: c.RZ_COMMERCIAL_TYPE_MANUFACTURING
            }]
        }, {
            fieldName: 'commercialBuildingType',
            name: 'Тип здания',
            allowedValues: [{
                label: 'Бизнес-центр',
                value: c.RZ_COMMERCIAL_BUILDING_TYPE_BUSINESS_CENTER
            }, {
                label: 'Складской комплекс',
                value: c.RZ_COMMERCIAL_BUILDING_TYPE_WAREHOUSE
            }, {
                label: 'Торговый центр',
                value: c.RZ_COMMERCIAL_BUILDING_TYPE_SHOPPING_CENTER
            }, {
                label: 'Отдельно стоящее здание',
                value: c.RZ_COMMERCIAL_BUILDING_TYPE_DETACHED_BUILDING
            }, {
                label: 'Встроенное помещение, жилой дом',
                value: c.RZ_COMMERCIAL_BUILDING_TYPE_RESIDENTIAL_BUILDING
            }]
        }, {
            fieldName: 'officeClass',
            name: 'Класс БЦ',
            allowedValues: [{
                label: 'A',
                value: c.RZ_COMMERCIAL_OFFICE_CLASS_A
            }, {
                label: 'A+',
                value: c.RZ_COMMERCIAL_OFFICE_CLASS_A_PLUS
            }, {
                label: 'B',
                value: c.RZ_COMMERCIAL_OFFICE_CLASS_B
            }, {
                label: 'B+',
                value: c.RZ_COMMERCIAL_OFFICE_CLASS_B_PLUS
            }, {
                label: 'C',
                value: c.RZ_COMMERCIAL_OFFICE_CLASS_C
            }, {
                label: 'C+',
                value: c.RZ_COMMERCIAL_OFFICE_CLASS_C_PLUS
            }]
        }, {
            fieldName: 'buildingName',
            name: 'Название БЦ',
            maxlength: 128,
            inlineError: 'Максимальная длина названия БЦ 128 символов включая пробелы'
        }, {
            fieldName: 'commercialArea',
            name: 'Площадь',
            pattern: '/^[0-9]{1,3}((\.|\,)[0-9]{1,2}){0,1}$/',
            inlineError: 'Число, например: 24.5'
        }, {
            fieldName: 'commercialRoomsTotal',
            name: 'Комнат в помещении',
            pattern: '/^[0-9]{4}$/',
            inlineError: 'Число, например: 10'
        }, {
            fieldName: 'entranceType',
            name: 'Вход в помещение',
            allowedValues: [{
                label: 'Отдельный',
                value: c.RZ_COMMERCIAL_ENTRANCE_TYPE_SEPARATE
            }, {
                label: 'Общий',
                value: c.RZ_COMMERCIAL_ENTRANCE_TYPE_COMMON
            }]
        }]
    }

    /**
     * Parameters spec getter
     *
     * @returns {*[]}
     */
    get paramsMap() {
        return this._paramsMap;
    }

    /**
     * Get list a allover values for field
     *
     * @param fieldName
     * @returns {*}
     */
    getAllowedValues(fieldName) {
        return _.find(this.paramsMap, {fieldName: fieldName}).allowedValues.map(item => {
            return item.value
        });
    }

    /**
     * Define Schema
     *
     * @override
     */
    defineSchema() {

        let Types = this.mongoose.Schema.Types;

        let $this = this;

        let schemaObject = {

            idNumber: {type: Number, index: {unique: true}},

            rpFeedItemId: {type: String, index: true},
            xmlMD5: {type: String},

            status: {
                type: Number,
                required: true,
                index: true,
                'default': c.OBJECT_STATUS_MODERATION_PENDING,
                validate: [{
                    validator: function (v) {
                        return [c.OBJECT_STATUS_DRAFT, c.OBJECT_STATUS_MODERATION_PENDING,
                                c.OBJECT_STATUS_REJECTED, c.OBJECT_STATUS_PUBLISHED,
                                c.OBJECT_STATUS_ARCHIVED].indexOf(v) > -1;
                    },
                    message: 'Значение "{VALUE}" недопустимо для статуса объекта'
                }]
            },

            offerType: {
                type: Number,
                required: true,
                index: true,
                validate: {
                    validator: function (v) {
                        return [c.RZ_OFFER_TYPE_SALE, c.RZ_OFFER_TYPE_RENT].indexOf(v) > -1;
                    },
                    message: 'Значение "{VALUE}" недопустимо для типа сделки'
                }
            },

            objectType: {
                type: Number,
                required: true,
                index: true,
                validate: {
                    validator: function (v) {
                        return [c.RZ_OBJECT_TYPE_FLAT, c.RZ_OBJECT_TYPE_ROOM, c.RZ_OBJECT_TYPE_HOUSE,
                                c.RZ_OBJECT_TYPE_LAND, c.RZ_OBJECT_TYPE_GARAGE,
                                c.RZ_OBJECT_TYPE_COMMERCIAL].indexOf(v) > -1;
                    },
                    message: 'Значение "{VALUE}" недопустимо для типа объекта'
                }
            },

            period: {
                type: Number,
                validate: {
                    validator: function (v) {
                        return [c.RZ_RENT_TYPE_MON, c.RZ_RENT_TYPE_DAY].indexOf(v) > -1;
                    },
                    message: 'Значение "{VALUE}" недопустимо для типа продолжительности аренды'
                }
            },

            megaCompoundType: {
                type: Number,
                index: true
            },

            title: {
                type: String,
                maxlength: [128, 'Длина заголовка объявления не может быть больше чем {MAXLENGTH} симв.']
            },

            images: [{type: Types.ObjectId, ref: 'image'}],

            user: {type: Types.ObjectId, ref: 'user', index: true,},

            price: {
                type: Number,
                required: true,
                index: true,
                min: [500, 'Значение цены не может быть меньше чем {MIN}'],
                max: [5000000000, 'Значение цены не может быть больше чем {MAX}']
            },

            prepayment: {
                type: Number,
                min: [0, 'Значение предоплаты не может быть меньше чем {MIN}'],
                max: [9999, 'Значение предоплаты не может быть больше чем {MAX}']
            },

            agentFee: {
                type: Number,
                min: [0, 'Значение комиссии агента не может быть меньше чем {MIN}'],
                max: [9999, 'Значение комиссии агента не может быть больше чем {MAX}']
            },

            securityPayment: {
                type: Number,
                min: [0, 'Значение обеспечительного платежа не может быть меньше чем {MIN}'],
                max: [9999, 'Значение обеспечительного платежа не может быть больше чем {MAX}']
            },

            dealStatus: {
                type: Number,
                validate: {
                    validator: function (v) {
                        return $this.getAllowedValues('dealStatus').indexOf(v) > -1;
                    },
                    message: 'Значение "{VALUE}" недопустимо для типа коммерческой сделки'
                }
            },

            taxationForm: {
                type: Number,
                validate: {
                    validator: function (v) {
                        return $this.getAllowedValues('taxationForm').indexOf(v) > -1;
                    },
                    message: 'Значение "{VALUE}" недопустимо для типа формы налогооблажения'
                }
            },

            description: {
                type: String,
                required: 'Поле описание не заполнено',
                maxlength: [1024, 'Длина описания объявления не может быть больше чем {MAXLENGTH} симв.']
            },

            geoAddress: {
                type: String
            },

            geoObl: {
                type: String,
                index: true,
                required: 'В адресе должна быть область, край или республика',
                maxlength: [128, 'Длина области объявления не может быть больше чем {MAXLENGTH} симв.']
            },

            geoRaion: {
                type: String,
                index: true,
                maxlength: [128, 'Длина района объявления не может быть больше чем {MAXLENGTH} симв.']
            },

            geoRaionEnName: {
                type: String,
                index: true
            },

            geoPlace: {
                type: String,
                index: true,
                maxlength: [128, 'Длина населенного пункта объявления не может быть больше чем {MAXLENGTH} симв.']
            },

            geoCityRaion: {
                type: String,
                index: true,
                maxlength: [128, 'Длина района населенного пункта объявления не может быть больше чем {MAXLENGTH} симв.']
            },

            geoMetro: {
                type: String,
                index: true,
                maxlength: [128, 'Длина станции метро объявления не может быть больше чем {MAXLENGTH} симв.']
            },

            geoDistance: {
                index: true,
                type: Number
            },

            geoStreet: {
                type: String,
                index: true,
                maxlength: [128, 'Длина улицы объявления не может быть больше чем {MAXLENGTH} симв.']
            },

            geoHouse: {
                type: String,
                index: true,
                maxlength: [64, 'Длина номера дома объявления не может быть больше чем {MAXLENGTH} симв.']
            },

            geoLatitude: {
                type: Number,
                required: 'Заполните адрес (поле широта обязательно)'
            },

            geoLongitude: {
                type: Number,
                required: 'Заполните адрес (поле долгота обязательно)'
            },

            yearBuild: {
                type: Number,
                min: [new Date().getFullYear() - 200, 'Год постройки не может быть меньше чем {MIN}'],
                max: [new Date().getFullYear(), 'Год постройки не может быть больше чем {MAX}']
            },

            lotArea: {
                type: Number,
                index: true,
                min: [0, 'Площадь участка не может быть меньше чем {MIN}'],
                max: [5000000, 'Площадь участка не может быть больше чем {MAX}']
            },

            lotAreaUnit: {
                type: Number,
                index: true,
                validate: {
                    validator: function (v) {
                        return [1, 2].indexOf(v) > -1;
                    },
                    message: 'Значение "{VALUE}" недопустимо для параметра измерения величины участка'
                }
            },

            lotType: {
                type: Number,
                index: true,
                validate: {
                    validator: function (v) {
                        return $this.getAllowedValues('lotType').indexOf(v) > -1;
                    },
                    message: 'Значение "{VALUE}" недопустимо для типа участка'
                }
            },

            shower: {
                type: Number,
                validate: {
                    validator: function (v) {
                        return $this.getAllowedValues('shower').indexOf(v) > -1;
                    },
                    message: 'Значение "{VALUE}" недопустимо для типа душа'
                }
            },

            toilet: {
                type: Number,
                validate: {
                    validator: function (v) {
                        return $this.getAllowedValues('toilet').indexOf(v) > -1;
                    },
                    message: 'Значение "{VALUE}" недопустимо для типа туалета'
                }
            },

            buildingType: {
                type: Number,
                index: true,
                validate: {
                    validator: function (v) {
                        return $this.getAllowedValues('buildingType').indexOf(v) > -1;
                    },
                    message: 'Значение "{VALUE}" недопустимо для типа дома'
                }
            },

            apartments: {type: Boolean},
            newFlat: {type: Boolean},
            lift: {type: Boolean},
            serviceLift: {type: Boolean},
            rubbishChute: {type: Boolean},
            security: {type: Boolean},
            privateTerritory: {type: Boolean},
            pmg: {type: Boolean},
            heatingSupply: {type: Boolean},
            sewerageSupply: {type: Boolean},
            gasSupply: {type: Boolean},
            sauna: {type: Boolean},
            kitchen: {type: Boolean},
            waterSupply: {type: Boolean},
            electricitySupply: {type: Boolean},
            billiard: {type: Boolean},
            pool: {type: Boolean},

            parkingType: {
                type: Number,
                validate: {
                    validator: function (v) {
                        return $this.getAllowedValues('parkingType').indexOf(v) > -1;
                    },
                    message: 'Значение "{VALUE}" недопустимо для типа парковки'
                }
            },

            floor: {
                type: Number,
                index: true,
                min: [-5, 'Этаж не может быть меньше чем {MIN}'],
                max: [100, 'Этаж не может быть больше чем {MAX}']
            },

            floorsTotal: {
                type: Number,
                index: true,
                min: [1, 'Этажность не может быть меньше чем {MIN}'],
                max: [100, 'Этажность не может быть больше чем {MAX}']
            },

            rooms: {
                type: Number,
                index: true,
                validate: {
                    validator: function (v) {
                        return $this.getAllowedValues('rooms').indexOf(v) > -1;
                    },
                    message: 'Значение "{VALUE}" недопустимо для количества комнат'
                }
            },

            roomsOffered: {
                type: Number,
                index: true,
                validate: {
                    validator: function (v) {
                        return [1, 2, 3, 4, 5].indexOf(v) > -1;
                    },
                    message: 'Значение "{VALUE}" недопустимо для количества комнат'
                }
            },

            houseType: {
                type: Number,
                index: true,
                validate: {
                    validator: function (v) {
                        return $this.getAllowedValues('houseType').indexOf(v) > -1;
                    },
                    message: 'Значение "{VALUE}" недопустимо для типа дома'
                }
            },

            houseArea: {
                type: Number,
                index: true,
                min: [2, 'Площадь дома не может быть меньше чем {MIN}'],
                max: [1000000, 'Площадь дома не может быть больше чем {MAX}']
            },

            houseFloors: {
                type: Number,
                index: true,
                min: [1, 'Количество этажей дома не может быть меньше чем {MIN}'],
                max: [99, 'Количество этажей дома не может быть больше чем {MAX}']
            },

            squareTotal: {
                type: Number,
                index: true,
                min: [2, 'Общая площадь не может быть меньше чем {MIN}'],
                max: [1000000, 'Общая площадь не может быть больше чем {MAX}']
            },

            squareLiving: {
                type: Number,
                index: true,
                min: [5, 'Жилая площадь не может быть меньше чем {MIN}'],
                max: [1000, 'Жилая площадь не может быть больше чем {MAX}']
            },

            squareKitchen: {
                type: Number,
                index: true,
                min: [5, 'Площадь кухни не может быть меньше чем {MIN}'],
                max: [200, 'Площадь кухни не может быть больше чем {MAX}']
            },

            squareRooms: {
                type: Number,
                index: true,
                min: [5, 'Площадь комнат не может быть меньше чем {MIN}'],
                max: [200, 'Площадь комнат не может быть больше чем {MAX}']
            },

            ceilingHeight: {
                type: Number,
                min: [1.5, 'Высота потолков не может быть меньше чем {MIN}'],
                max: [10, 'Высота потолков не может быть больше чем {MAX}']
            },

            bathroom: {
                type: Number,
                validate: {
                    validator: function (v) {
                        return $this.getAllowedValues('bathroom').indexOf(v) > -1;
                    },
                    message: 'Значение "{VALUE}" недопустимо для типа санузла'
                }
            },

            balcony: {
                type: Number,
                validate: {
                    validator: function (v) {
                        return $this.getAllowedValues('balcony').indexOf(v) > -1;
                    },
                    message: 'Значение "{VALUE}" недопустимо для типа балкона'
                }
            },

            windowViewYard: {type: Boolean},
            windowViewStreet: {type: Boolean},

            covering: {
                type: Number,
                validate: {
                    validator: function (v) {
                        return $this.getAllowedValues('covering').indexOf(v) > -1;
                    },
                    message: 'Значение "{VALUE}" недопустимо для типа покрытия пола'
                }
            },

            renovation: {
                type: Number,
                validate: {
                    validator: function (v) {
                        return $this.getAllowedValues('renovation').indexOf(v) > -1;
                    },
                    message: 'Значение "{VALUE}" недопустимо для типа ремонта'
                }
            },

            haggle: {type: Boolean},
            mortgage: {type: Boolean},
            rentPledge: {type: Boolean},
            cleaningIncluded: {type: Boolean},
            utilitiesIncluded: {type: Boolean},
            electricityIncluded: {type: Boolean},

            phone: {type: Boolean},

            roomFurniture: {type: Boolean},

            buildInTech: {type: Boolean},

            refrigerator: {type: Boolean},

            internet: {type: Boolean},

            kitchenFurniture: {type: Boolean},

            aircondition: {type: Boolean},

            television: {type: Boolean},

            washingMachine: {type: Boolean},

            dishwasher: {type: Boolean},

            tv: {type: Boolean},

            flatAlarm: {type: Boolean},

            withChildren: {type: Boolean},

            withPets: {type: Boolean},

            cadastralNumber: {
                type: String,
                maxlength: [64, 'Длина кадастрового номера не может быть больше чем {MAXLENGTH} симв.']
            },

            garageType: {
                type: Number,
                index: true,
                validate: {
                    validator: function (v) {
                        return $this.getAllowedValues('garageType').indexOf(v) > -1;
                    },
                    message: 'Значение "{VALUE}" недопустимо для типа гараж'
                }
            },

            garageGarageType: {
                type: Number,
                index: true,
                validate: {
                    validator: function (v) {
                        return $this.getAllowedValues('garageGarageType').indexOf(v) > -1;
                    },
                    message: 'Значение "{VALUE}" недопустимо для типа гаража объекта гараж'
                }
            },

            garageBoxType: {
                type: Number,
                validate: {
                    validator: function (v) {
                        return $this.getAllowedValues('garageBoxType').indexOf(v) > -1;
                    },
                    message: 'Значение "{VALUE}" недопустимо для типа бокса гаража'
                }
            },

            garageArea: {
                type: Number,
                index: true,
                min: [2, 'Площадь гаража не может быть меньше чем {MIN}'],
                max: [1000000, 'Площадь гаража не может быть больше чем {MAX}']
            },

            garageStatus: {
                type: Number,
                validate: {
                    validator: function (v) {
                        return $this.getAllowedValues('garageStatus').indexOf(v) > -1;
                    },
                    message: 'Значение "{VALUE}" недопустимо для типа статуса гаража'
                }
            },

            gsk: {
                type: String,
                maxlength: [128, 'Длина названия ГСК не может быть больше чем {MAXLENGTH} симв.']
            },

            garageParking: {
                type: Number,
                validate: {
                    validator: function (v) {
                        return $this.getAllowedValues('garageParking').indexOf(v) > -1;
                    },
                    message: 'Значение "{VALUE}" недопустимо для типа парковки гаража'
                }
            },

            commercialType: {
                type: Number,
                index: true,
                validate: {
                    validator: function (v) {
                        return $this.getAllowedValues('commercialType').indexOf(v) > -1;
                    },
                    message: 'Значение "{VALUE}" недопустимо для основного назначения коммерческой недвижимости'
                }
            },

            commercialBuildingType: {
                type: Number,
                index: true,
                validate: {
                    validator: function (v) {
                        return $this.getAllowedValues('commercialBuildingType').indexOf(v) > -1;
                    },
                    message: 'Значение "{VALUE}" недопустимо для типа здания коммерческой недвижимости'
                }
            },

            officeClass: {
                type: Number,
                validate: {
                    validator: function (v) {
                        return $this.getAllowedValues('officeClass').indexOf(v) > -1;
                    },
                    message: 'Значение "{VALUE}" недопустимо для класса бизнес-центра'
                }
            },

            buildingName: {
                type: String,
                maxlength: [128, 'Длина названия ГСК не может быть больше чем {MAXLENGTH} симв.']
            },

            commercialArea: {
                type: Number,
                index: true,
                min: [2, 'Площадь коммерческой не может быть меньше чем {MIN}'],
                max: [1000000, 'Площадь коммерческой не может быть больше чем {MAX}']
            },

            commercialLotArea: {
                type: Number,
                index: true,
                min: [2, 'Площадь коммерческой не может быть меньше чем {MIN}'],
                max: [1000000, 'Площадь коммерческой не может быть больше чем {MAX}']
            },

            commercialRoomsTotal: {
                type: Number,
                min: [1, 'Кол-во комнат коммерческой не может быть меньше чем {MIN}'],
                max: [9999, 'Кол-во комнат коммерческой не может быть больше чем {MAX}']
            },

            entranceType: {
                type: Number,
                validate: {
                    validator: function (v) {
                        return $this.getAllowedValues('entranceType').indexOf(v) > -1;
                    },
                    message: 'Значение "{VALUE}" недопустимо для типа входа в помещение'
                }
            },

            purposeBank: {type: Boolean},
            purposeFoodStore: {type: Boolean},
            purposeBeautyShop: {type: Boolean},
            purposeTourAgency: {type: Boolean},
            purposeMedicalCenter: {type: Boolean},
            purposeShowRoom: {type: Boolean},
            purposeAlcohol: {type: Boolean},
            purposeStoreHouse: {type: Boolean},
            purposePharmaceutical: {type: Boolean},

            ventilation: {type: Boolean},
            fireAlarm: {type: Boolean},
            twentyFourSeven: {type: Boolean},
            accessControlSystem: {type: Boolean},
            parking: {type: Boolean},
            eatingFacilities: {type: Boolean},
            selfSelectionTelecom: {type: Boolean},
            addingPhoneOnRequest: {type: Boolean},
            officeWarehouse: {type: Boolean},
            responsibleStorage: {type: Boolean},
            freightElevator: {type: Boolean},
            truckEntrance: {type: Boolean},
            ramp: {type: Boolean},
            railway: {type: Boolean},
            serviceThreePl: {type: Boolean},

            slug: {
                type: String,
                index: true,
                unique: true
            },

            url: {
                type: String,
                unique: true
            },

            views: {
                type: Number,
                default: 0,
                validate: {
                    validator: v => {
                        return v >= 0;
                    },
                    message: 'Значение "{VALUE}" недопустимо для количества просмотров'
                }
            },

            updatedAt: {type: Date, 'default': Date.now},
            createdAt: {type: Date, 'default': Date.now},

            // Реальное время последнего обновления пользователем или фидом
            lastUpdate: {type: Date, default: Date.now},

            lastModifiedBy: {type: Types.ObjectId, ref: 'user'},

            seoData: {
                keywords: {type: String},
            },

            jsonLd: {
                '@id': {type: String},
                type: {type: String},
                name: {type: String},
                description: {type: String},
                category: {
                    '@type': [{type: String}],
                    name: {type: String},
                    url: {type: String},
                    description: {type: String} // todo @seo add some descriptions
                },
                photo: {
                    '@type': {type: String},
                    name: {type: String},
                    contentUrl: {type: String},
                    datePublished: {type: String},
                    thumbnail: {
                        type: 'object',
                        properties: {
                            '@type': [{type: String}],
                            name: {type: String},
                            contentUrl: {type: String},
                            datePublished: {type: String}
                        }
                    }
                },
                address: {
                    '@type': [{type: String}],
                    streetAddress: {type: String},
                    addressLocality: {type: String},
                    addressRegion: {type: String}
                },
                geo: {
                    '@type': [{type: String}],
                    latitude: {type: Number},
                    longitude: {type: Number}
                },
                offers: {
                    '@type': [{type: String}],
                    businessFunction: {type: String},
                    price: {type: Number},
                    priceCurrency: {type: String},
                    priceSpecification: {
                        properties: {
                            '@type': [{type: String}],
                            unitCode: {type: String},
                            price: {type: Number},
                            priceCurrency: {type: String}
                        }
                    },
                    validFrom: {type: String}
                },
                numberOfRooms: {type: String},
                floorSize: {
                    '@type': [{type: String}],
                    value: {type: Number},
                    unitText: {type: String},
                    unitCode: {type: String}
                }
            }
        };

        // Creating DBO Schema
        let ObjectDBOSchema = this.createSchema(schemaObject);

        // Assign compound object type
        ObjectDBOSchema.pre('save', function (done) {

            //this.compoundObjectType = $this.getCompoundObjectType(this);

            this.megaCompoundType = $this.getMegaCompoundType(this);

            done();
        });

        // Translate raion name
        ObjectDBOSchema.pre('save', function (done) {

            if (this.geoRaion) {
                this.geoRaionEnName = speakingUrl(this.geoRaion, {lang: 'ru', separator: '-'});
            }

            done();
        });

        // Generate title & slug if it's required
        ObjectDBOSchema.pre('save', function (done) {

            this.title = $this.generateTitle(this);
            this.slug = $this.generateSlug(this);

            if (!this.idNumber) {

                /**
                 * Let's make assign idNumber here (it's not available at this moment due to middlewares order)
                 */
                $this.getNextId((err, nextId) => {
                    if (err) {
                        $this.logger.error(err);
                        return done(err);
                    }

                    this.idNumber = nextId;

                    done();
                });

            } else {

                done();
            }
        });

        // Generate object full url
        ObjectDBOSchema.pre('save', function (done) {

            this.url = $this.obtainObjectUrl(this);

            done();
        });

        // Create seoData keywords
        ObjectDBOSchema.pre('save', function (done) {

            let seoData = $this.generateSeoTags(this);

            this.seoData.keywords = seoData.keywords;

            done();
        });

        // Generate jsonLd
        ObjectDBOSchema.pre('save', function (done) {

            let streetAddress = `${this.geoStreet} ${this.geoHouse}`;

            this.jsonLd = {
                '@id': this.url,
                type: ['Product'],
                name: this.title,
                description: this.description,
                address: {
                    '@type': 'PostalAddress',
                    streetAddress: streetAddress,
                    addressLocality: this.geoRaion,
                    addressRegion: this.geoObl
                },
                geo: {
                    '@type': 'GeoCoordinates',
                    latitude: this.geoLatitude,
                    longitude: this.geoLongitude
                },
                offers: {
                    '@type': 'Offer',
                    validFrom: moment(this.createdAt).format('YYYY-MM-DD')
                }
            };

            if (this.images.length > 0) {

                this.jsonLd.photo = this.images.map(image => {

                    return {
                        '@type': 'ImageObject',
                        name: image.title,
                        contentUrl: image.cdnUrl,
                        datePublished: moment(image.createdAt).format('YYYY-MM-DD'),
                        thumbnail: {
                            '@type': 'ImageObject',
                            name: image.title,
                            contentUrl: image.thumbnailCdnUrl,
                            datePublished: moment(image.createdAt).format('YYYY-MM-DD'),
                        }
                    }
                });
            }

            if (this.offerType === c.RZ_OFFER_TYPE_SALE) {

                this.jsonLd.offers.businessFunction = 'http://purl.org/goodrelations/v1#Sell';
                this.jsonLd.offers.price = this.price;
                this.jsonLd.offers.priceCurrency = 'RUB';

            } else {

                this.jsonLd.offers.businessFunction = 'http://purl.org/goodrelations/v1#LeaseOut';
                this.jsonLd.offers.priceSpecification = {
                    '@type': 'UnitPriceSpecification',
                    unitCode: this.period === c.RZ_RENT_TYPE_DAY ? 'DAY' : 'MON',
                    price: this.price,
                    priceCurrency: 'RUB'
                };
            }

            if (this.objectType === c.RZ_OBJECT_TYPE_FLAT) {

                this.jsonLd.type = 'Apartment';

                this.jsonLd.numberOfRooms = this.rooms;

                this.jsonLd.floorSize = [{
                    '@type': 'QuantitativeValue',
                    value: this.squareTotal,
                    unitText: 'Общая площадь',
                    unitCode: 'MTK'
                }, {
                    '@type': 'QuantitativeValue',
                    value: this.squareLiving,
                    unitText: 'Жилая площадь',
                    unitCode: 'MTK'
                }, {
                    '@type': 'QuantitativeValue',
                    value: this.squareKitchen,
                    unitText: 'Площадь кухни',
                    unitCode: 'MTK'
                }];

            } else if (this.objectType === c.RZ_OBJECT_TYPE_ROOM) {

                this.jsonLd.type = 'Room';

                this.jsonLd.floorSize = {
                    '@type': 'QuantitativeValue',
                    value: this.squareRooms,
                    unitCode: 'MTK'
                };

            } else if (this.objectType === c.RZ_OBJECT_TYPE_HOUSE) {

                this.jsonLd.type = 'House';

                this.jsonLd.numberOfRooms = this.rooms;

                this.jsonLd.floorSize = [{
                    '@type': 'QuantitativeValue',
                    value: this.squareTotal,
                    unitText: 'Общая площадь',
                    unitCode: 'MTK'
                }, {
                    '@type': 'QuantitativeValue',
                    value: this.squareLiving,
                    unitText: 'Жилая площадь',
                    unitCode: 'MTK'
                }, {
                    '@type': 'QuantitativeValue',
                    value: this.squareKitchen,
                    unitText: 'Площадь кухни',
                    unitCode: 'MTK'
                }];

            } else if (this.objectType === c.RZ_OBJECT_TYPE_LAND) {

                // Пока нет типа данных..
                this.jsonLd.type = 'Place';

            } else if (this.objectType === c.RZ_OBJECT_TYPE_GARAGE) {

                // Пока нет типа данных..
                this.jsonLd.type = 'Place';

            } else if (this.objectType === c.RZ_OBJECT_TYPE_COMMERCIAL) {

                // Пока нет типа данных..
                this.jsonLd.type = 'Place';
            }

            done();
        });

        // Remove images
        ObjectDBOSchema.pre('remove', function (callback) {

            if (this.images.length == 0) return callback();

            require('./image').findAll({_id: {$in: this.images}}, (err, images) => {
                async.eachSeries(images, (image, callback) => {
                    image.remove(callback);
                }, err => {
                    if (err) $this.logger.error(err);
                    callback();
                });
            });
        });

        // Registering schema and initializing model
        this.registerSchema(ObjectDBOSchema);
    }

    generateTitle(object) {

        const objectType = +object.objectType;
        const offerType = +object.offerType;

        let titleArr = [];
        let suffix;

        if (offerType == c.RZ_OFFER_TYPE_SALE) {

            titleArr.push('Купить');

        } else {

            if (+object.objectType === c.RZ_OBJECT_TYPE_COMMERCIAL) {

                titleArr.push('Аренда');

            } else {

                titleArr.push('Снять');
            }
        }

        switch (objectType) {
            case c.RZ_OBJECT_TYPE_FLAT:
                if (object.rooms) {
                    titleArr.push(roomsMap.strToData[roomsMap.numberToStr[object.rooms]].text5);
                }
                break;
            case c.RZ_OBJECT_TYPE_ROOM:
                if (objectType) {
                    titleArr.push(objectTypeMap.strToData[objectTypeMap.numberToStr[objectType]].text2);
                }
                break;
            case c.RZ_OBJECT_TYPE_HOUSE:
                if (object.houseType) {
                    titleArr.push(buildingsMap.strToData[buildingsMap.numberToStr[+object.houseType]].text5);
                }
                if (object.floorsTotal) {
                    suffix = `${viewFilters.textual(object.floorsTotal, 'этажей', 'этаж', 'этажа', true)}`;
                }
                break;
            case c.RZ_OBJECT_TYPE_LAND:
                titleArr.push('земельный участок');
                if (object.lotType) {
                    let lotType = (+object.lotType === c.RZ_LOT_AREA_UNIT_AR) ? 'соток' : 'гектар';
                    suffix = `${object.lotArea} ${lotType}`;
                }
                break;
            case c.RZ_OBJECT_TYPE_GARAGE:
                titleArr.push('гараж');
                break;
            case c.RZ_OBJECT_TYPE_COMMERCIAL:
                if (object.commercialType) {
                    if (offerType == c.RZ_OFFER_TYPE_SALE) {
                        titleArr.push(commercialMap.strToData[commercialMap.numberToStr[+object.commercialType]].text5);
                    } else {
                        titleArr.push(commercialMap.strToData[commercialMap.numberToStr[+object.commercialType]].text3);
                    }
                }
                if (object.commercialArea) {
                    suffix = `${object.commercialArea} м²`;
                }
                break;
            default:
                throw new Error('Wrong object type!');
        }

        let megaGeoObl = ['Санкт-Петербург', 'Москва', 'Севастополь'];

        if (megaGeoObl.indexOf(object.geoObl) > -1) {
            titleArr.push(object.geoObl);
        }


        if (object.geoRaion) {
            titleArr.push(object.geoRaion);
        }

        if (object.geoPlace && object.geoPlace !== object.geoRaion) {
            titleArr.push(object.geoPlace);
        }

        if (object.geoStreet) {
            titleArr.push(object.geoStreet);
        }

        if (object.geoDistance <= 500 && object.geoMetro) {
            titleArr.push('метро ' + object.geoMetro);
        } else if (object.geoCityRaion) {
            titleArr.push(object.geoCityRaion);
        } else if (object.geoMetro) {
            titleArr.push('метро ' + object.geoMetro);
        }
        /*} else if (object.geoRaion) {
         titleArr.push(object.geoRaion);
         } else {
         titleArr.push(object.geoObl);*/

        if (suffix) titleArr.push(suffix);

        let firstElement = titleArr.shift();

        console.log(titleArr);
        console.log(firstElement);
        console.log(titleArr.join(', '));

        return firstElement + ' ' + titleArr.join(', ');
    }

    /**
     * Generate slug for item
     *
     * @param instance
     */
    generateSlug(instance) {

        let slug = speakingUrl(instance.title, {
            lang: 'ru'
        });

        slug += '-' + instance.id;

        return slug;
    }

    /**
     * Obtain object URL
     *
     * @param object
     * @returns {string}
     */
    obtainObjectUrl(object) {

        let region = _.find(regions, {name: object.geoObl});

        if (!region) {

            throw new Error(`Unable to get region for "${object.geoObl}"`);
        }

        let url = Core.ApplicationFacade.instance.config.env.HTTP_PROTOCOL + '://' + region.abbreviation + '.' +
            Core.ApplicationFacade.instance.config.env.HTTP_DOMAIN;

        if (object.geoRaion) {

            url += `/${speakingUrl(object.geoRaion, {lang: 'ru', separator: '-'})}`;
        }

        url += `/${offerTypeMap.numberToStr[object.offerType]}`;

        url += `/${objectTypeMap.numberToStr[object.objectType]}`;

        if ([c.RZ_OBJECT_TYPE_FLAT, c.RZ_OBJECT_TYPE_ROOM].indexOf(object.objectType) > -1) {

            if (roomsMap.numberToStr[object.rooms]) {

                url += `/${roomsMap.numberToStr[object.rooms]}`;
            }
        } else if (object.objectType === c.RZ_OBJECT_TYPE_HOUSE) {

            if (buildingsMap.numberToStr[object.houseType]) {

                url += `/${buildingsMap.numberToStr[object.houseType]}`;
            }
        } else if (object.objectType === c.RZ_OBJECT_TYPE_LAND) {

            if (landsMap.numberToStr[object.landType]) {

                url += `/${landsMap.numberToStr[object.landType]}`;
            }
        } else if (object.objectType === c.RZ_OBJECT_TYPE_GARAGE) {

            if (garagesMap.numberToStr[object.garageType]) {

                url += `/${garagesMap.numberToStr[object.garageType]}`;
            }
        } else if (object.objectType === c.RZ_OBJECT_TYPE_COMMERCIAL) {

            if (commercialMap.numberToStr[object.commercialType]) {

                url += `/${commercialMap.numberToStr[object.commercialType]}`;
            }
        }

        url += `/${object.slug}`;

        return url;
    }

    /**
     * Generate SEO data keywords of object
     *
     * @param object
     * @returns {{keywords}}
     */
    generateSeoTags(object) {

        let keywords = 'realza, реалза, недвижимость';

        if (object.offerType === c.RZ_OFFER_TYPE_SALE) {

            keywords += ', купить, продажа';

        } else {

            keywords += ', снять, аренда';
        }

        switch (object.megaCompoundType) {
            case c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_1_ROOM_SALE:
                keywords += ', квартира, 1, 1к, однокомнатная';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_2_ROOM_SALE:
                keywords += ', квартира, 2, 2к, двухкомнатная';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_3_ROOM_SALE:
                keywords += ', квартира, 3, 3к, трехкомнатная';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_4_ROOM_SALE:
                keywords += ', квартира, 4, 4к, четырехкомнатная';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_5_ROOM_SALE:
                keywords += ', квартира, 5, 5к, пятикомнатная, многокомнатная';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_STUDIO_ROOM_SALE:
                keywords += ', квартира, студия, однокомнатная';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_OPEN_ROOM_SALE:
                keywords += ', квартира, свободная планировка, свободная, планировка';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_ROOM_SALE:
                keywords += ', комната';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_HOUSE_SALE:
                keywords += ', дом';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_HOUSE_COTTAGE_SALE:
                keywords += ', дом, коттедж';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_HOUSE_DACHA_SALE:
                keywords += ', дача, дом';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_HOUSE_TOWNHOUSE_SALE:
                keywords += ', таунхаус, дом';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_HOUSE_HALF_HOUSE_SALE:
                keywords += ', часть дома, дом';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_LOT_IGS_SALE:
                keywords += ', участок, участок ИЖС, ИЖС, участок под строительство, под строительство, поселение';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_LOT_GARDEN_SALE:
                keywords += ', участок, в садоводстве, садоводческий участок';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_LOT_FARM_SALE:
                keywords += ', участок, фермерский, фермерский участок';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_GARAGE_SALE:
                keywords += ', гараж';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_GARAGE_PARKING_PLACE_SALE:
                keywords += ', машиноместо';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_GARAGE_BOX_SALE:
                keywords += ', гараж, бокс, гараж бокс';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_OFFICE_SALE:
                keywords += ', коммерческая, офис, офисное помещение';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_RETAIL_SALE:
                keywords += ', коммерческая, помещение, торговое, торговое помещение';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_FREE_PURPOSE_SALE:
                keywords += ', коммерческая, помещение, свободное, свободное помещение, помещение свободного назначения';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_PUBLIC_CATERING_SALE:
                keywords += ', коммерческая, общепит, столовая';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_AUTO_REPAIR_SALE:
                keywords += ', коммерческая, автосервис, авто-сервис';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_BUSINESS_SALE:
                keywords += ', коммерческая, бизнес, готовый бизнес';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_LAND_SALE:
                keywords += ', коммерческая, участок, земельный участок, коммерческий участок';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_HOTEL_SALE:
                keywords += ', коммерческая, гостиница, отель';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_WAREHOUSE_SALE:
                keywords += ', коммерческая, склад, складское помещение';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_MANUFACTURING_SALE:
                keywords += ', коммерческая, производственное, производственное помещение';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_1_ROOM_RENT:
                keywords += ', квартира, 1, 1к, однокомнатная';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_2_ROOM_RENT:
                keywords += ', квартира, 2, 2к, двухкомнатная';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_3_ROOM_RENT:
                keywords += ', квартира, 3, 3к, трехкомнатная';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_4_ROOM_RENT:
                keywords += ', квартира, 4, 4к, четырехкомнатная';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_5_ROOM_RENT:
                keywords += ', квартира, 5, 5к, пятикомнатная, многокомнатная';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_STUDIO_ROOM_RENT:
                keywords += ', квартира, студия, однокомнатная';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_OPEN_ROOM_RENT:
                keywords += ', квартира, свободная планировка, свободная, планировка';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_ROOM_RENT:
                keywords += ', комната';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_HOUSE_RENT:
                keywords += ', дом';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_HOUSE_COTTAGE_RENT:
                keywords += ', дом, коттедж';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_HOUSE_DACHA_RENT:
                keywords += ', дача, дом';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_HOUSE_TOWNHOUSE_RENT:
                keywords += ', таунхаус, дом';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_HOUSE_HALF_HOUSE_RENT:
                keywords += ', часть дома, дом';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_GARAGE_RENT:
                keywords += ', гараж';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_GARAGE_PARKING_PLACE_RENT:
                keywords += ', машиноместо';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_GARAGE_BOX_RENT:
                keywords += ', гараж, бокс, гараж бокс';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_OFFICE_RENT:
                keywords += ', коммерческая, офис, офисное помещение';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_RETAIL_RENT:
                keywords += ', коммерческая, помещение, торговое, торговое помещение';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_FREE_PURPOSE_RENT:
                keywords += ', коммерческая, помещение, свободное, свободное помещение, помещение свободного назначения';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_PUBLIC_CATERING_RENT:
                keywords += ', коммерческая, общепит, столовая';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_AUTO_REPAIR_RENT:
                keywords += ', коммерческая, автосервис, авто-сервис';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_BUSINESS_RENT:
                keywords += ', коммерческая, бизнес, готовый бизнес';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_LEGAL_ADDRESS_RENT:
                keywords += ', коммерческая, адрес, легальный адрес, юридический адрес';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_LAND_RENT:
                keywords += ', коммерческая, участок, земельный участок, коммерческий участок';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_HOTEL_RENT:
                keywords += ', коммерческая, гостиница, отель';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_WAREHOUSE_RENT:
                keywords += ', коммерческая, склад, складское помещение';
                break;
            case c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_MANUFACTURING_RENT:
                keywords += ', коммерческая, производственное, производственное помещение';
                break;
        }

        if (object.geoObl) {
            keywords += ', ' + object.geoObl;
        }

        if (object.geoRaion) {
            keywords += ', ' + object.geoRaion;
        }

        if (object.geoDistance <= 500 && object.geoMetro) {
            keywords += ', метро, ' + object.geoMetro;
        } else if (object.geoCityRaion) {
            keywords += ', ' + object.geoCityRaion;
        } else if (object.geoMetro) {
            keywords += ', метро, ' + object.geoMetro;
        } else if (object.geoStreet) {
            keywords += ', ' + object.geoStreet;
        }

        return {
            keywords: keywords
        };
    }

}

/**
 * Creating instance of the model
 */
let modelInstance = new ObjectModel('object');

/**
 * Exporting Model
 *
 * @type {Function}
 */
exports = module.exports = modelInstance;