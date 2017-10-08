'use strict';

/**
 * Should library
 *
 * @type {should|exports|module.exports}
 */
const should = require('should');

/**
 * Request helper
 * @type {Request|exports|module.exports}
 */
const request = require('../../common/_request');

const addressModel = require('../../../app/models/address');

it('Query #1', done => {
    request.get(`/geocoder?q=${encodeURIComponent('хутор Трудобеликовский')}`, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        body.should.be.lengthOf(1);

        body[0].geoObl.should.be.equal('Краснодарский край');
        body[0].geoRaion.should.be.equal('Красноармейский район');
        body[0].geoPlace.should.be.equal('хутор Трудобеликовский');
        should.not.exists(body[0].geoStreet);
        should.not.exists(body[0].geoHouse);

        done();
    });
});

it('Query #2', done => {
    request.get(`/geocoder?q=${encodeURIComponent('Нижний Новгород поселок Черепичный')}`, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        body.should.be.lengthOf(1);

        body[0].should.deepEqual({
            geoAddress: 'Нижегородская область, Нижний Новгород, посёлок Черепичный',
            geoLatitude: 56.24481,
            geoLongitude: 44.002717,
            geoObl: 'Нижегородская область',
            geoRaion: 'Нижний Новгород',
            geoPlace: 'посёлок Черепичный'
        });

        done();
    });
});

it('Query #3', done => {
    request.get(`/geocoder?q=${encodeURIComponent('Верхнее Джемете')}`, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        body.should.be.lengthOf(1);

        body[0].geoObl.should.be.equal('Краснодарский край');
        body[0].geoRaion.should.be.equal('Анапа');
        body[0].geoPlace.should.be.equal('поселок Верхнее Джемете');
        should.not.exists(body[0].geoStreet);
        should.not.exists(body[0].geoHouse);

        done();
    });
});

it('Query #4', done => {
    request.get(`/geocoder?q=${encodeURIComponent('Ростовская область, Ростов-на-Дону, Дальневосточная улица')}`, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        body.should.be.lengthOf(1);

        body[0].geoObl.should.be.equal('Ростовская область');
        body[0].geoRaion.should.be.equal('Ростов-на-Дону');
        should.not.exists(body[0].geoPlace);
        body[0].geoStreet.should.be.equal('Дальневосточная улица');
        should.not.exists(body[0].geoHouse);

        done();
    });
});

it('Query #2 (full)', done => {
    request.get(`/geocoder?full=1&q=${encodeURIComponent('Нижегородская область, Нижний Новгород, посёлок Черепичный')}`, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        body.should.deepEqual({
            geoAddress: 'Нижегородская область, Нижний Новгород, посёлок Черепичный',
            geoLatitude: 56.24481,
            geoLongitude: 44.002717,
            geoObl: 'Нижегородская область',
            geoRaion: 'Нижний Новгород',
            geoPlace: 'посёлок Черепичный',
            geoMetro: 'Пролетарская',
            geoDistance: 6051
        });

        done();
    });
});

it('Query #4 (full)', done => {
    request.get(`/geocoder?full=1&q=${encodeURIComponent('Ростовская область, Ростов-на-Дону, Дальневосточная улица')}`, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        body.should.deepEqual({
            geoAddress: 'Ростовская область, Ростов-на-Дону, Дальневосточная улица',
            geoLatitude: 47.222237,
            geoLongitude: 39.665345,
            geoObl: 'Ростовская область',
            geoRaion: 'Ростов-на-Дону',
            geoCityRaion: 'Ленгородок (микрорайон)',
            geoStreet: 'Дальневосточная улица'
        });

        done();
    });
});

it('resolveOneAddress(): #1', done => {

    addressModel.resolveOneAddress('Нижний Новгород Ванеева 21', (err, address) => {
        should.not.exists(err);

        address.should.deepEqual({
            geoAddress: 'Нижегородская область, Нижний Новгород, улица Ванеева, 21',
            geoLatitude: 56.311591,
            geoLongitude: 44.019587,
            geoObl: 'Нижегородская область',
            geoRaion: 'Нижний Новгород',
            geoPlace: undefined,
            geoCityRaion: 'Советский район',
            geoMetro: 'Горьковская',
            geoDistance: 1584,
            geoStreet: 'улица Ванеева',
            geoHouse: '21'
        });

        done();
    });
});

it('resolveOneAddress(): #1 (from cache)', done => {

    addressModel.resolveOneAddress('Нижний Новгород Ванеева 21', (err, address) => {
        should.not.exists(err);

        address.should.deepEqual({
            geoAddress: 'Нижегородская область, Нижний Новгород, улица Ванеева, 21',
            geoLatitude: 56.311591,
            geoLongitude: 44.019587,
            geoObl: 'Нижегородская область',
            geoRaion: 'Нижний Новгород',
            geoPlace: undefined,
            geoCityRaion: 'Советский район',
            geoMetro: 'Горьковская',
            geoDistance: 1584,
            geoStreet: 'улица Ванеева',
            geoHouse: '21'
        });

        done();
    });
});

it('resolveOneAddress(): #2', done => {

    addressModel.resolveOneAddress('Нижний Новгород улица горная 19', (err, address) => {
        should.not.exists(err);

        address.should.deepEqual({
            geoAddress: 'Нижегородская область, Нижний Новгород, Горная улица, 19',
            geoLatitude: 56.257218,
            geoLongitude: 43.986188,
            geoObl: 'Нижегородская область',
            geoRaion: 'Нижний Новгород',
            geoPlace: undefined,
            geoCityRaion: 'Приокский район',
            geoMetro: 'Двигатель Революции',
            geoDistance: 4564,
            geoStreet: 'Горная улица',
            geoHouse: '19'
        });

        done();
    });
});

it('resolveOneAddress(): #3', done => {

    addressModel.resolveOneAddress('Москва, Нагорная ул., 19 корпус 1', (err, address) => {
        should.not.exists(err);

        address.should.deepEqual({
            geoAddress: 'Москва, Нагорная улица, 19к1',
            geoLatitude: 55.678788,
            geoLongitude: 37.604538,
            geoObl: 'Москва',
            geoRaion: undefined,
            geoPlace: undefined,
            geoCityRaion: 'район Котловка',
            geoMetro: 'Нагорная',
            geoDistance: 767,
            geoStreet: 'Нагорная улица',
            geoHouse: '19к1'
        });

        done();
    });
});

it('resolveOneAddress(): #4', done => {

    addressModel.resolveOneAddress('хутор Трудобеликовский', (err, address) => {
        should.not.exists(err);

        address.should.deepEqual({
            geoAddress: 'Краснодарский край, Красноармейский район, хутор Трудобеликовский',
            geoLatitude: 45.268877,
            geoLongitude: 38.159274,
            geoObl: 'Краснодарский край',
            geoRaion: 'Красноармейский район',
            geoPlace: 'хутор Трудобеликовский',
            geoCityRaion: undefined,
            geoMetro: undefined,
            geoDistance: undefined,
            geoStreet: undefined,
            geoHouse: undefined
        });

        done();
    });
});