'use strict';

/**
 * Application constants
 */
const c = require('../index');

const map = {
    strToData: {
        'ofis': {
            number: c.RZ_COMMERCIAL_TYPE_OFFICE,
            nameUrl: 'ofis',
            text1: 'офис',
            text2: 'офисы',
            text3: 'офиса',
            text4: 'офисов',
            text5: 'офис'
        },
        'torgovoe-pomeshenie': {
            number: c.RZ_COMMERCIAL_TYPE_RETAIL,
            nameUrl: 'torgovoe-pomeshenie',
            text1: 'торговое помещение',
            text2: 'торговые помещения',
            text3: 'торговых помещения',
            text4: 'торговых помещений',
            text5: 'торговое помещение'
        },
        'pomeshenie-svobodnogo-naznacheniya': {
            number: c.RZ_COMMERCIAL_TYPE_FREE_PURPOSE,
            nameUrl: 'pomeshenie-svobodnogo-naznacheniya',
            text1: 'помещение свободного назначения',
            text2: 'помещения свободного назначения',
            text3: 'помещения свободного назначения',
            text4: 'помещений свободного назначения',
            text5: 'помещение свободного назначения'
        },
        'obshepit': {
            number: c.RZ_COMMERCIAL_TYPE_PUBLIC_CATERING,
            nameUrl: 'obshepit',
            text1: 'общепит',
            text2: 'общепиты',
            text3: 'общепита',
            text4: 'общепитов',
            text5: 'общепит'
        },
        'avtoservis': {
            number: c.RZ_COMMERCIAL_TYPE_AUTO_REPAIR,
            nameUrl: 'avtoservis',
            text1: 'автосервис',
            text2: 'автосервисы',
            text3: 'автосервиса',
            text4: 'автосервисов',
            text5: 'автосервис'
        },
        'gotovyi-biznes': {
            number: c.RZ_COMMERCIAL_TYPE_BUSINESS,
            nameUrl: 'gotovyi-biznes',
            text1: 'готовый бизнес',
            text2: 'готовые бизнесы',
            text3: 'готового бизнеса',
            text4: 'готовых бизнесов',
            text5: 'готовый бизнес'
        },
        'yuridicheskiy-adres': {
            number: c.RZ_COMMERCIAL_TYPE_LEGAL_ADDRESS,
            nameUrl: 'yuridicheskiy-adres',
            text1: 'юридический адрес',
            text2: 'юридические адреса',
            text3: 'юридического адреса',
            text4: 'юридических адресов',
            text5: 'юридический адрес'
        },
        'zemelnyi-uchastok': {
            number: c.RZ_COMMERCIAL_TYPE_LAND,
            nameUrl: 'zemelnyi-uchastok',
            text1: 'земельный участок',
            text2: 'земельные участки',
            text3: 'земельного участка',
            text4: 'земельных участков',
            text5: 'земельный участок'
        },
        'gostinica': {
            number: c.RZ_COMMERCIAL_TYPE_HOTEL,
            nameUrl: 'gostinica',
            text1: 'гостиница',
            text2: 'гостиницы',
            text3: 'гостиницы',
            text4: 'гостиниц',
            text5: 'гостиницу'
        },
        'sklad': {
            number: c.RZ_COMMERCIAL_TYPE_WAREHOUSE,
            nameUrl: 'sklad',
            text1: 'склад',
            text2: 'склады',
            text3: 'склада',
            text4: 'складов',
            text5: 'склад'
        },
        'proizvodstvennoe-pomeshenie': {
            number: c.RZ_COMMERCIAL_TYPE_MANUFACTURING,
            nameUrl: 'proizvodstvennoe-pomeshenie',
            text1: 'производственное помещение',
            text2: 'производственные помещения',
            text3: 'производственного помещения',
            text4: 'производственных помещений',
            text5: 'производственное помещение'
        }
    },
    numberToStr: {}
};

map.numberToStr[c.RZ_COMMERCIAL_TYPE_OFFICE]          = 'ofis';
map.numberToStr[c.RZ_COMMERCIAL_TYPE_RETAIL]          = 'torgovoe-pomeshenie';
map.numberToStr[c.RZ_COMMERCIAL_TYPE_FREE_PURPOSE]    = 'pomeshenie-svobodnogo-naznacheniya';
map.numberToStr[c.RZ_COMMERCIAL_TYPE_PUBLIC_CATERING] = 'obshepit';
map.numberToStr[c.RZ_COMMERCIAL_TYPE_AUTO_REPAIR]     = 'avtoservis';
map.numberToStr[c.RZ_COMMERCIAL_TYPE_BUSINESS]        = 'gotovyi-biznes';
map.numberToStr[c.RZ_COMMERCIAL_TYPE_LEGAL_ADDRESS]   = 'yuridicheskiy-adres';
map.numberToStr[c.RZ_COMMERCIAL_TYPE_LAND]            = 'zemelnyi-uchastok';
map.numberToStr[c.RZ_COMMERCIAL_TYPE_HOTEL]           = 'gostinica';
map.numberToStr[c.RZ_COMMERCIAL_TYPE_WAREHOUSE]       = 'sklad';
map.numberToStr[c.RZ_COMMERCIAL_TYPE_MANUFACTURING]   = 'proizvodstvennoe-pomeshenie';

/**
 * Export map
 */
module.exports = map;