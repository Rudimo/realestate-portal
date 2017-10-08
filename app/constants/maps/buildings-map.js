'use strict';

/**
 * Application constants
 */
const c = require('../index');

const map = {
    strToData: {
        'dom': {
            number: c.RZ_HOUSE_TYPE_HOUSE,
            nameUrl: 'dom',
            text1: 'дом',
            text2: 'дома',
            text3: 'дома',
            text4: 'дома',
            text5: 'дом'
        },
        'kottedzh': {
            number: c.RZ_HOUSE_TYPE_COTTAGE,
            nameUrl: 'kottedzh',
            text1: 'коттедж',
            text2: 'коттеджи',
            text3: 'коттеджа',
            text4: 'коттеджей',
            text5: 'коттедж'
        },
        'dacha': {
            number: c.RZ_HOUSE_TYPE_DACHA,
            nameUrl: 'dacha',
            text1: 'дача',
            text2: 'дачи',
            text3: 'дачи',
            text4: 'дач',
            text5: 'дачу'
        },
        'taunhaus': {
            number: c.RZ_HOUSE_TYPE_TOWNHOUSE,
            nameUrl: 'taunhaus',
            text1: 'таунхаус',
            text2: 'таунхаусы',
            text3: 'таунхауса',
            text4: 'таунхаусов',
            text5: 'таунхаус'
        },
        'chasti-doma': {
            number: c.RZ_HOUSE_TYPE_HALF_HOUSE,
            nameUrl: 'chasti-doma',
            text1: 'часть дома',
            text2: 'части домов',
            text3: 'частей дома',
            text4: 'частей домов',
            text5: 'часть дома'
        }
    },
    numberToStr: {}
};

map.numberToStr[c.RZ_HOUSE_TYPE_HOUSE]      = 'dom';
map.numberToStr[c.RZ_HOUSE_TYPE_COTTAGE]    = 'kottedzh';
map.numberToStr[c.RZ_HOUSE_TYPE_DACHA]      = 'dacha';
map.numberToStr[c.RZ_HOUSE_TYPE_TOWNHOUSE]  = 'taunhaus';
map.numberToStr[c.RZ_HOUSE_TYPE_HALF_HOUSE] = 'chasti-doma';

/**
 * Export map
 */
module.exports = map;