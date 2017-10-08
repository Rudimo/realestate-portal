'use strict';

/**
 * Should library
 *
 * @type {should|exports|module.exports}
 */
const should = require('should');

/**
 * Random string library
 */
const randomstring = require("randomstring");

/**
 * Request helper
 * @type {Request|exports|module.exports}
 */
const request = require('../../common/_request');

const objectModel = require('../../../app/models/object');

const commonTests = require('../../common/_tests');

const EMAIL = 'rudimo@yandex.ru';
const PASSWORD = '112233';

const c = require('../../../app/constants/index');

const REGION_URL = 'http://krasnodarskiy.rz.ru:' + process.env.SERVER_PORT + '/';

it('Sign out', commonTests.signOut);

it('Sign In', done => {
    commonTests.signIn({email: EMAIL, password: PASSWORD}, done);
});



it('Index page realestate region list', done => {
    request.get('/', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        console.log($('body').html());
        $('a:contains(Краснодарский край \(56\))').text().should.be.ok();

        done();
    });
});

it('Region index page', done => {
    request.getAnyUrl(REGION_URL, (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Уточнить район)').text().should.be.ok();
        $('a:contains(однокомнатные \(1\))').text().should.be.ok();

        done();
    });
});

it('sale odnokomnatnaya', done => {
    request.getAnyUrl(REGION_URL + 'kupit/kvartira/odnokomnatnaya', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Купить)').text().should.be.ok();
        $('a:contains(Квартиру)').text().should.be.ok();
        $('a:contains(Однокомнатные)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('sale dvuhkomnatnaya', done => {
    request.getAnyUrl(REGION_URL + 'kupit/kvartira/dvuhkomnatnaya', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Купить)').text().should.be.ok();
        $('a:contains(Квартиру)').text().should.be.ok();
        $('a:contains(Двухкомнатные)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('sale trekhkomnatnaya', done => {
    request.getAnyUrl(REGION_URL + 'kupit/kvartira/trekhkomnatnaya', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Купить)').text().should.be.ok();
        $('a:contains(Квартиру)').text().should.be.ok();
        $('a:contains(Трехкомнатные)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('sale chetyrekhkomnatnaya', done => {
    request.getAnyUrl(REGION_URL + 'kupit/kvartira/chetyrekhkomnatnaya', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Купить)').text().should.be.ok();
        $('a:contains(Квартиру)').text().should.be.ok();
        $('a:contains(Четырехкомнатные)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('sale pyatikomnatnaya', done => {
    request.getAnyUrl(REGION_URL + 'kupit/kvartira/pyatikomnatnaya', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Купить)').text().should.be.ok();
        $('a:contains(Квартиру)').text().should.be.ok();
        $('a:contains(Пятикомнатные)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('sale studiya', done => {
    request.getAnyUrl(REGION_URL + 'kupit/kvartira/studiya', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Купить)').text().should.be.ok();
        $('a:contains(Квартиру)').text().should.be.ok();
        $('a:contains(Студии)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('sale svobodnaya-planirovka', done => {
    request.getAnyUrl(REGION_URL + 'kupit/kvartira/svobodnaya-planirovka', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Купить)').text().should.be.ok();
        $('a:contains(Квартиру)').text().should.be.ok();
        $('a:contains(Свободная планировка)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('rent odnokomnatnaya', done => {
    request.getAnyUrl(REGION_URL + 'snyat/kvartira/odnokomnatnaya', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Снять)').text().should.be.ok();
        $('a:contains(Квартиру)').text().should.be.ok();
        $('a:contains(Однокомнатные)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('rent dvuhkomnatnaya', done => {
    request.getAnyUrl(REGION_URL + 'snyat/kvartira/dvuhkomnatnaya', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Снять)').text().should.be.ok();
        $('a:contains(Квартиру)').text().should.be.ok();
        $('a:contains(Двухкомнатные)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('rent trekhkomnatnaya', done => {
    request.getAnyUrl(REGION_URL + 'snyat/kvartira/trekhkomnatnaya', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Снять)').text().should.be.ok();
        $('a:contains(Квартиру)').text().should.be.ok();
        $('a:contains(Трехкомнатные)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('rent chetyrekhkomnatnaya', done => {
    request.getAnyUrl(REGION_URL + 'snyat/kvartira/chetyrekhkomnatnaya', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Снять)').text().should.be.ok();
        $('a:contains(Квартиру)').text().should.be.ok();
        $('a:contains(Четырехкомнатные)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('rent pyatikomnatnaya', done => {
    request.getAnyUrl(REGION_URL + 'snyat/kvartira/pyatikomnatnaya', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Снять)').text().should.be.ok();
        $('a:contains(Квартиру)').text().should.be.ok();
        $('a:contains(Пятикомнатные)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('rent studiya', done => {
    request.getAnyUrl(REGION_URL + 'snyat/kvartira/studiya', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Снять)').text().should.be.ok();
        $('a:contains(Квартиру)').text().should.be.ok();
        $('a:contains(Студии)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('rent svobodnaya-planirovka', done => {
    request.getAnyUrl(REGION_URL + 'snyat/kvartira/svobodnaya-planirovka', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Снять)').text().should.be.ok();
        $('a:contains(Квартиру)').text().should.be.ok();
        $('a:contains(Свободная планировка)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('sale dom', done => {
    request.getAnyUrl(REGION_URL + 'kupit/dom/dom', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Купить)').text().should.be.ok();
        $('a:contains(Дом)').text().should.be.ok();
        $('a:contains(Дома)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('sale kottedzh', done => {
    request.getAnyUrl(REGION_URL + 'kupit/dom/kottedzh', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Купить)').text().should.be.ok();
        $('a:contains(Дом)').text().should.be.ok();
        $('a:contains(Коттеджи)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('sale dacha', done => {
    request.getAnyUrl(REGION_URL + 'kupit/dom/dacha', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Купить)').text().should.be.ok();
        $('a:contains(Дом)').text().should.be.ok();
        $('a:contains(Дачи)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('sale taunhaus', done => {
    request.getAnyUrl(REGION_URL + 'kupit/dom/taunhaus', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Купить)').text().should.be.ok();
        $('a:contains(Дом)').text().should.be.ok();
        $('a:contains(Таунхаусы)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('sale chasti-doma', done => {
    request.getAnyUrl(REGION_URL + 'kupit/dom/chasti-doma', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Купить)').text().should.be.ok();
        $('a:contains(Дом)').text().should.be.ok();
        $('a:contains(Части домов)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('rent dom', done => {
    request.getAnyUrl(REGION_URL + 'snyat/dom/dom', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Снять)').text().should.be.ok();
        $('a:contains(Дом)').text().should.be.ok();
        $('a:contains(Дома)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('rent kottedzh', done => {
    request.getAnyUrl(REGION_URL + 'snyat/dom/kottedzh', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Снять)').text().should.be.ok();
        $('a:contains(Дом)').text().should.be.ok();
        $('a:contains(Коттеджи)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('rent dacha', done => {
    request.getAnyUrl(REGION_URL + 'snyat/dom/dacha', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Снять)').text().should.be.ok();
        $('a:contains(Дом)').text().should.be.ok();
        $('a:contains(Дачи)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('rent taunhaus', done => {
    request.getAnyUrl(REGION_URL + 'snyat/dom/taunhaus', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Снять)').text().should.be.ok();
        $('a:contains(Дом)').text().should.be.ok();
        $('a:contains(Таунхаусы)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('rent chasti-doma', done => {
    request.getAnyUrl(REGION_URL + 'snyat/dom/chasti-doma', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Снять)').text().should.be.ok();
        $('a:contains(Дом)').text().should.be.ok();
        $('a:contains(Части домов)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('sale komnata', done => {
    request.getAnyUrl(REGION_URL + 'kupit/komnata', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Купить)').text().should.be.ok();
        $('a:contains(Комнату)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('rent komnata', done => {
    request.getAnyUrl(REGION_URL + 'snyat/komnata', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Снять)').text().should.be.ok();
        $('a:contains(Комнату)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('sale ofis', done => {
    request.getAnyUrl(REGION_URL + 'kupit/kommercheskaya-nedvizhimost/ofis', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Купить)').text().should.be.ok();
        $('a:contains(Коммерческую недвижимость)').text().should.be.ok();
        $('a:contains(Офисы)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('sale torgovoe-pomeshenie', done => {
    request.getAnyUrl(REGION_URL + 'kupit/kommercheskaya-nedvizhimost/torgovoe-pomeshenie', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Купить)').text().should.be.ok();
        $('a:contains(Коммерческую недвижимость)').text().should.be.ok();
        $('a:contains(Торговые помещения)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('sale pomeshenie-svobodnogo-naznacheniya', done => {
    request.getAnyUrl(REGION_URL +
        'kupit/kommercheskaya-nedvizhimost/pomeshenie-svobodnogo-naznacheniya', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Купить)').text().should.be.ok();
        $('a:contains(Коммерческую недвижимость)').text().should.be.ok();
        $('a:contains(Помещения свободного назначения)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('sale obshepit', done => {
    request.getAnyUrl(REGION_URL + 'kupit/kommercheskaya-nedvizhimost/obshepit', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Купить)').text().should.be.ok();
        $('a:contains(Коммерческую недвижимость)').text().should.be.ok();
        $('a:contains(Общепиты)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('sale avtoservis', done => {
    request.getAnyUrl(REGION_URL + 'kupit/kommercheskaya-nedvizhimost/avtoservis', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Купить)').text().should.be.ok();
        $('a:contains(Коммерческую недвижимость)').text().should.be.ok();
        $('a:contains(Автосервисы)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('sale gotovyi-biznes', done => {
    request.getAnyUrl(REGION_URL + 'kupit/kommercheskaya-nedvizhimost/gotovyi-biznes', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Купить)').text().should.be.ok();
        $('a:contains(Коммерческую недвижимость)').text().should.be.ok();
        $('a:contains(Готовые бизнесы)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('sale zemelnyi-uchastok', done => {
    request.getAnyUrl(REGION_URL + 'kupit/kommercheskaya-nedvizhimost/zemelnyi-uchastok', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Купить)').text().should.be.ok();
        $('a:contains(Коммерческую недвижимость)').text().should.be.ok();
        $('a:contains(Земельные участки)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('sale gostinica', done => {
    request.getAnyUrl(REGION_URL + 'kupit/kommercheskaya-nedvizhimost/gostinica', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Купить)').text().should.be.ok();
        $('a:contains(Коммерческую недвижимость)').text().should.be.ok();
        $('a:contains(Гостиницы)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('sale sklad', done => {
    request.getAnyUrl(REGION_URL + 'kupit/kommercheskaya-nedvizhimost/sklad', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Купить)').text().should.be.ok();
        $('a:contains(Коммерческую недвижимость)').text().should.be.ok();
        $('a:contains(Склады)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('sale proizvodstvennoe-pomeshenie', done => {
    request.getAnyUrl(REGION_URL +
        'kupit/kommercheskaya-nedvizhimost/proizvodstvennoe-pomeshenie', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Купить)').text().should.be.ok();
        $('a:contains(Коммерческую недвижимость)').text().should.be.ok();
        $('a:contains(Производственные помещения)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('rent ofis', done => {
    request.getAnyUrl(REGION_URL + 'snyat/kommercheskaya-nedvizhimost/ofis', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Снять)').text().should.be.ok();
        $('a:contains(Коммерческую недвижимость)').text().should.be.ok();
        $('a:contains(Офисы)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('rent torgovoe-pomeshenie', done => {
    request.getAnyUrl(REGION_URL + 'snyat/kommercheskaya-nedvizhimost/torgovoe-pomeshenie', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Снять)').text().should.be.ok();
        $('a:contains(Коммерческую недвижимость)').text().should.be.ok();
        $('a:contains(Торговые помещения)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('rent pomeshenie-svobodnogo-naznacheniya', done => {
    request.getAnyUrl(REGION_URL +
        'snyat/kommercheskaya-nedvizhimost/pomeshenie-svobodnogo-naznacheniya', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Снять)').text().should.be.ok();
        $('a:contains(Коммерческую недвижимость)').text().should.be.ok();
        $('a:contains(Помещения свободного назначения)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('rent obshepit', done => {
    request.getAnyUrl(REGION_URL + 'snyat/kommercheskaya-nedvizhimost/obshepit', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Снять)').text().should.be.ok();
        $('a:contains(Коммерческую недвижимость)').text().should.be.ok();
        $('a:contains(Общепиты)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('rent avtoservis', done => {
    request.getAnyUrl(REGION_URL + 'snyat/kommercheskaya-nedvizhimost/avtoservis', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Снять)').text().should.be.ok();
        $('a:contains(Коммерческую недвижимость)').text().should.be.ok();
        $('a:contains(Автосервисы)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('rent gotovyi-biznes', done => {
    request.getAnyUrl(REGION_URL + 'snyat/kommercheskaya-nedvizhimost/gotovyi-biznes', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Снять)').text().should.be.ok();
        $('a:contains(Коммерческую недвижимость)').text().should.be.ok();
        $('a:contains(Готовые бизнесы)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('rent yuridicheskiy-adres', done => {
    request.getAnyUrl(REGION_URL + 'snyat/kommercheskaya-nedvizhimost/yuridicheskiy-adres', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Снять)').text().should.be.ok();
        $('a:contains(Коммерческую недвижимость)').text().should.be.ok();
        $('a:contains(Юридические адреса)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('rent zemelnyi-uchastok', done => {
    request.getAnyUrl(REGION_URL + 'snyat/kommercheskaya-nedvizhimost/zemelnyi-uchastok', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Снять)').text().should.be.ok();
        $('a:contains(Коммерческую недвижимость)').text().should.be.ok();
        $('a:contains(Земельные участки)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('rent gostinica', done => {
    request.getAnyUrl(REGION_URL + 'snyat/kommercheskaya-nedvizhimost/gostinica', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Снять)').text().should.be.ok();
        $('a:contains(Коммерческую недвижимость)').text().should.be.ok();
        $('a:contains(Гостиницы)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('rent sklad', done => {
    request.getAnyUrl(REGION_URL + 'snyat/kommercheskaya-nedvizhimost/sklad', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Снять)').text().should.be.ok();
        $('a:contains(Коммерческую недвижимость)').text().should.be.ok();
        $('a:contains(Склады)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('rent proizvodstvennoe-pomeshenie', done => {
    request.getAnyUrl(REGION_URL +
        'snyat/kommercheskaya-nedvizhimost/proizvodstvennoe-pomeshenie', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Снять)').text().should.be.ok();
        $('a:contains(Коммерческую недвижимость)').text().should.be.ok();
        $('a:contains(Производственные помещения)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('sale individualnoe-stroitelstvo', done => {
    request.getAnyUrl(REGION_URL + 'kupit/uchastok/individualnoe-stroitelstvo', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Купить)').text().should.be.ok();
        $('a:contains(Участок)').text().should.be.ok();
        $('a:contains(Земли поселения)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('sale v-sadovodstve', done => {
    request.getAnyUrl(REGION_URL + 'kupit/uchastok/v-sadovodstve', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Купить)').text().should.be.ok();
        $('a:contains(Участок)').text().should.be.ok();
        $('a:contains(В садоводствах)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('sale fermerskiy', done => {
    request.getAnyUrl(REGION_URL + 'kupit/uchastok/fermerskiy', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Купить)').text().should.be.ok();
        $('a:contains(Участок)').text().should.be.ok();
        $('a:contains(Фермерские)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('sale garazh', done => {
    request.getAnyUrl(REGION_URL + 'kupit/garazh/garazh', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Купить)').text().should.be.ok();
        $('a:contains(Гараж)').text().should.be.ok();
        $('a:contains(Гаражи)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('sale mashinomesto', done => {
    request.getAnyUrl(REGION_URL + 'kupit/garazh/mashinomesto', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Купить)').text().should.be.ok();
        $('a:contains(Гараж)').text().should.be.ok();
        $('a:contains(Машиноместа)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('sale boks', done => {
    request.getAnyUrl(REGION_URL + 'kupit/garazh/boks', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Купить)').text().should.be.ok();
        $('a:contains(Гараж)').text().should.be.ok();
        $('a:contains(Боксы)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('rent garazh', done => {
    request.getAnyUrl(REGION_URL + 'snyat/garazh/garazh', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Снять)').text().should.be.ok();
        $('a:contains(Гараж)').text().should.be.ok();
        $('a:contains(Гаражи)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('rent mashinomesto', done => {
    request.getAnyUrl(REGION_URL + 'snyat/garazh/mashinomesto', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Снять)').text().should.be.ok();
        $('a:contains(Гараж)').text().should.be.ok();
        $('a:contains(Машиноместа)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});

it('rent boks', done => {
    request.getAnyUrl(REGION_URL + 'snyat/garazh/boks', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('a:contains(Краснодарский край)').text().should.be.ok();
        $('a:contains(Снять)').text().should.be.ok();
        $('a:contains(Гараж)').text().should.be.ok();
        $('a:contains(Боксы)').text().should.be.ok();
        $('span:contains(1 000 000)').text().should.be.ok();

        done();
    });
});