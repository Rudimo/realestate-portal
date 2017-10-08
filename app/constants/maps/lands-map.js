'use strict';

/**
 * Application constants
 */
const c = require('../index');

const map = {
    strToData: {
        'individualnoe-stroitelstvo': {
            number: c.RZ_LOT_TYPE_IGS,
            nameUrl: 'individualnoe-stroitelstvo',
            text1: 'индивидуальное строительство',
            text2: 'земли поселения',
            text3: 'участка поселения',
            text4: 'землей поселения'
        },
        'v-sadovodstve': {
            number: c.RZ_LOT_TYPE_GARDEN,
            nameUrl: 'v-sadovodstve',
            text1: 'в садоводстве',
            text2: 'в садоводствах',
            text3: 'в садоводстве',
            text4: 'садоводческих'
        }
        ,
        'fermerskiy': {
            number: c.RZ_LOT_TYPE_FARM,
            nameUrl: 'fermerskiy',
            text1: 'фермерский',
            text2: 'фермерские',
            text3: 'фермерского',
            text4: 'фермерских'
        }
    },
    numberToStr: {}
};

map.numberToStr[c.RZ_LOT_TYPE_IGS] = 'individualnoe-stroitelstvo';
map.numberToStr[c.RZ_LOT_TYPE_GARDEN] = 'v-sadovodstve';
map.numberToStr[c.RZ_LOT_TYPE_FARM] = 'fermerskiy';

/**
 * Export map
 */
module.exports = map;