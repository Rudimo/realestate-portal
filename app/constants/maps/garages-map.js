'use strict';

/**
 * Application constants
 */
const c = require('../index');

const map = {
    strToData: {
        'mashinomesto': {
            number: c.RZ_GARAGE_TYPE_PARKING_PLACE,
            nameUrl: 'mashinomesto',
            text1: 'машиноместо',
            text2: 'машиноместа',
            text4: 'машиномест'
        },
        'garazh': {
            number: c.RZ_GARAGE_TYPE_GARAGE,
            nameUrl: 'garazh',
            text1: 'гараж',
            text2: 'гаражи',
            text4: 'гаражей'
        },
        'boks': {
            number: c.RZ_GARAGE_TYPE_BOX,
            nameUrl: 'boks',
            text1: 'бокс',
            text2: 'боксы',
            text4: 'боксов'
        }
    },
    numberToStr: {}
};

map.numberToStr[c.RZ_GARAGE_TYPE_PARKING_PLACE]  = 'mashinomesto';
map.numberToStr[c.RZ_GARAGE_TYPE_GARAGE]  = 'garazh';
map.numberToStr[c.RZ_GARAGE_TYPE_BOX]  = 'boks';

/**
 * Export map
 */
module.exports = map;