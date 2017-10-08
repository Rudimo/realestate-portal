'use strict';

/**
 * Application constants
 */
const c = require('../index');

const map = {
    strToData: {
        'kupit': {
            number: c.RZ_OFFER_TYPE_SALE,
            nameUrl: 'kupit',
            text1: 'купить',
            text2: 'продажа',
            text3: 'продаже'
        },
        'snyat': {
            number: c.RZ_OFFER_TYPE_RENT,
            nameUrl: 'snyat',
            text1: 'снять',
            text2: 'аренда',
            text3: 'аренде'
        }
    },
    numberToStr: {}
};

map.numberToStr[c.RZ_OFFER_TYPE_SALE] = 'kupit';
map.numberToStr[c.RZ_OFFER_TYPE_RENT] = 'snyat';

/**
 * Export map
 */
module.exports = map;