'use strict';

/**
 * Application constants
 */
const c = require('../index');

const map = {
    strToData: {
        'odnokomnatnaya': {
            number: c.RZ_ROOMS_TYPE_ONE,
            nameUrl: 'odnokomnatnaya',
            text1: 'однокомнатная',
            text2: 'однокомнатные',
            text4: 'однокомнатных квартир',
            text5: 'однокомнатную квартиру',
        },
        'dvuhkomnatnaya': {
            number: c.RZ_ROOMS_TYPE_TWO,
            nameUrl: 'dvuhkomnatnaya',
            text1: 'двухкомнатная',
            text2: 'двухкомнатные',
            text4: 'двухкомнатных квартир',
            text5: 'двухкомнатную квартиру',
        },
        'trekhkomnatnaya': {
            number: c.RZ_ROOMS_TYPE_THREE,
            nameUrl: 'trekhkomnatnaya',
            text1: 'трехкомнатная',
            text2: 'трехкомнатные',
            text4: 'трехкомнатных квартир',
            text5: 'трехкомнатную квартиру',
        },
        'chetyrekhkomnatnaya': {
            number: c.RZ_ROOMS_TYPE_FOUR,
            nameUrl: 'chetyrekhkomnatnaya',
            text1: 'четырехкомнатная',
            text2: 'четырехкомнатные',
            text4: 'четырехкомнатных квартир',
            text5: 'четырехкомнатную квартиру',
        },
        'pyatikomnatnaya': {
            number: c.RZ_ROOMS_TYPE_FIVE,
            nameUrl: 'pyatikomnatnaya',
            text1: 'пятикомнатная',
            text2: 'пятикомнатные',
            text4: 'пятикомнатных квартир',
            text5: 'пятикомнатную квартиру',
        },
        'studiya': {
            number: c.RZ_ROOMS_TYPE_STUDIO,
            nameUrl: 'studiya',
            text1: 'студия',
            text2: 'студии',
            text4: 'студий',
            text5: 'квартиру студию',
        },
        'svobodnaya-planirovka': {
            number: c.RZ_ROOMS_TYPE_OPEN,
            nameUrl: 'svobodnaya-planirovka',
            text1: 'свободная планировка',
            text2: 'свободная планировка',
            text4: 'свободная планировка',
            text5: 'квартиру свободной планировки',
        }
    },
    numberToStr: {}
};

map.numberToStr[c.RZ_ROOMS_TYPE_ONE] = 'odnokomnatnaya';
map.numberToStr[c.RZ_ROOMS_TYPE_TWO] = 'dvuhkomnatnaya';
map.numberToStr[c.RZ_ROOMS_TYPE_THREE] = 'trekhkomnatnaya';
map.numberToStr[c.RZ_ROOMS_TYPE_FOUR] = 'chetyrekhkomnatnaya';
map.numberToStr[c.RZ_ROOMS_TYPE_FIVE] = 'pyatikomnatnaya';
map.numberToStr[c.RZ_ROOMS_TYPE_STUDIO] = 'studiya';
map.numberToStr[c.RZ_ROOMS_TYPE_OPEN] = 'svobodnaya-planirovka';

/**
 * Export map
 */
module.exports = map;