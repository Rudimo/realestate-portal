'use strict';

/**
 * Application constants
 */
const c = require('../index');

// By: http://translit-online.ru/

const map = {
    strToData: {
        'kvartira': {
            number: c.RZ_OBJECT_TYPE_FLAT,
            nameUrl: 'kvartira',
            text1: 'квартира',
            text2: 'квартиру',
            text3: 'квартиры',
            text4: 'квартир'
        },
        'komnata': {
            number: c.RZ_OBJECT_TYPE_ROOM,
            nameUrl: 'komnata',
            text1: 'комнаты',
            text2: 'комнату',
            text3: 'комнаты',
            text4: 'комнат'
        },
        'dom': {
            number: c.RZ_OBJECT_TYPE_HOUSE,
            nameUrl: 'dom',
            text1: 'дом',
            text2: 'дом',
            text3: 'дома',
            text4: 'домов'
        },
        'uchastok': {
            number: c.RZ_OBJECT_TYPE_LAND,
            nameUrl: 'uchastok',
            text1: 'участок',
            text2: 'участок',
            text3: 'участки',
            text4: 'участков'
        },
        'garazh': {
            number: c.RZ_OBJECT_TYPE_GARAGE,
            nameUrl: 'garazh',
            text1: 'гараж',
            text2: 'гараж',
            text3: 'гаражи',
            text4: 'гаражей'
        },
        'kommercheskaya-nedvizhimost': {
            number: c.RZ_OBJECT_TYPE_COMMERCIAL,
            nameUrl: 'kommercheskaya-nedvizhimost',
            text1: 'коммерческая недвижимость',
            text2: 'коммерческую недвижимость',
            text3: 'коммерческая недвижимость',
            text4: 'коммерческой недвижимости'
        }
    },
    numberToStr: {}
};

map.numberToStr[c.RZ_OBJECT_TYPE_FLAT]       = 'kvartira';
map.numberToStr[c.RZ_OBJECT_TYPE_ROOM]       = 'komnata';
map.numberToStr[c.RZ_OBJECT_TYPE_HOUSE]      = 'dom';
map.numberToStr[c.RZ_OBJECT_TYPE_LAND]       = 'uchastok';
map.numberToStr[c.RZ_OBJECT_TYPE_GARAGE]     = 'garazh';
map.numberToStr[c.RZ_OBJECT_TYPE_COMMERCIAL] = 'kommercheskaya-nedvizhimost';

/**
 * Export map
 */
module.exports = map;