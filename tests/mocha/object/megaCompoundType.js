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

const CREATE_OBJECT_URL = '/user/objects/create';

const c = require('../../../app/constants/index');

const GEO_OBL = 'Краснодарский край';
const GEO_RAION = 'Красноармейский район';
const PRICE = 1000000;
const DESCR = randomstring.generate(10);
const LAT = 45.2824762;
const LON = 38.1385849;

it('Sign out', commonTests.signOut);

it('Sign In', done => {
    commonTests.signIn({email: EMAIL, password: PASSWORD}, done);
});

it('RZ_MEGA_CMP_OBJECT_TYPE_FLAT_1_ROOM_SALE', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_SALE,
        objectType: c.RZ_OBJECT_TYPE_FLAT,
        rooms: c.RZ_ROOMS_TYPE_ONE,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON,
        status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            console.log(object);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_1_ROOM_SALE);

            done();
        });
    });
});


it('RZ_MEGA_CMP_OBJECT_TYPE_FLAT_2_ROOM_SALE', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_SALE,
        objectType: c.RZ_OBJECT_TYPE_FLAT,
        rooms: c.RZ_ROOMS_TYPE_TWO,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON,
        status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        console.log(body);
        console.log(body.id);
        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            console.log(object);
            console.log(c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_2_ROOM_SALE);
            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_2_ROOM_SALE);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_FLAT_3_ROOM_SALE', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_SALE,
        objectType: c.RZ_OBJECT_TYPE_FLAT,
        rooms: c.RZ_ROOMS_TYPE_THREE,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON,
        status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_3_ROOM_SALE);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_FLAT_4_ROOM_SALE', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_SALE,
        objectType: c.RZ_OBJECT_TYPE_FLAT,
        rooms: c.RZ_ROOMS_TYPE_FOUR,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON,
        status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_4_ROOM_SALE);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_FLAT_5_ROOM_SALE', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_SALE,
        objectType: c.RZ_OBJECT_TYPE_FLAT,
        rooms: c.RZ_ROOMS_TYPE_FIVE,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_5_ROOM_SALE);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_FLAT_STUDIO_ROOM_SALE', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_SALE,
        objectType: c.RZ_OBJECT_TYPE_FLAT,
        rooms: c.RZ_ROOMS_TYPE_STUDIO,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_STUDIO_ROOM_SALE);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_FLAT_OPEN_ROOM_SALE', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_SALE,
        objectType: c.RZ_OBJECT_TYPE_FLAT,
        rooms: c.RZ_ROOMS_TYPE_OPEN,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_OPEN_ROOM_SALE);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_ROOM_SALE', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_SALE,
        objectType: c.RZ_OBJECT_TYPE_ROOM,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_ROOM_SALE);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_HOUSE_SALE', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_SALE,
        objectType: c.RZ_OBJECT_TYPE_HOUSE,
        houseType: c.RZ_HOUSE_TYPE_HOUSE,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_HOUSE_SALE);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_HOUSE_COTTAGE_SALE', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_SALE,
        objectType: c.RZ_OBJECT_TYPE_HOUSE,
        houseType: c.RZ_HOUSE_TYPE_COTTAGE,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_HOUSE_COTTAGE_SALE);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_HOUSE_DACHA_SALE', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_SALE,
        objectType: c.RZ_OBJECT_TYPE_HOUSE,
        houseType: c.RZ_HOUSE_TYPE_DACHA,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_HOUSE_DACHA_SALE);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_HOUSE_TOWNHOUSE_SALE', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_SALE,
        objectType: c.RZ_OBJECT_TYPE_HOUSE,
        houseType: c.RZ_HOUSE_TYPE_TOWNHOUSE,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_HOUSE_TOWNHOUSE_SALE);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_HOUSE_HALF_HOUSE_SALE', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_SALE,
        objectType: c.RZ_OBJECT_TYPE_HOUSE,
        houseType: c.RZ_HOUSE_TYPE_HALF_HOUSE,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_HOUSE_HALF_HOUSE_SALE);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_LOT_IGS_SALE', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_SALE,
        objectType: c.RZ_OBJECT_TYPE_LAND,
        lotType: c.RZ_LOT_TYPE_IGS,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_LOT_IGS_SALE);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_LOT_GARDEN_SALE', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_SALE,
        objectType: c.RZ_OBJECT_TYPE_LAND,
        lotType: c.RZ_LOT_TYPE_GARDEN,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_LOT_GARDEN_SALE);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_LOT_FARM_SALE', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_SALE,
        objectType: c.RZ_OBJECT_TYPE_LAND,
        lotType: c.RZ_LOT_TYPE_FARM,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_LOT_FARM_SALE);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_GARAGE_SALE', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_SALE,
        objectType: c.RZ_OBJECT_TYPE_GARAGE,
        garageType: c.RZ_GARAGE_TYPE_GARAGE,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_GARAGE_SALE);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_GARAGE_PARKING_PLACE_SALE', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_SALE,
        objectType: c.RZ_OBJECT_TYPE_GARAGE,
        garageType: c.RZ_GARAGE_TYPE_PARKING_PLACE,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_GARAGE_PARKING_PLACE_SALE);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_GARAGE_BOX_SALE', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_SALE,
        objectType: c.RZ_OBJECT_TYPE_GARAGE,
        garageType: c.RZ_GARAGE_TYPE_BOX,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_GARAGE_BOX_SALE);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_OFFICE_SALE', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_SALE,
        objectType: c.RZ_OBJECT_TYPE_COMMERCIAL,
        commercialType: c.RZ_COMMERCIAL_TYPE_OFFICE,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_OFFICE_SALE);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_RETAIL_SALE', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_SALE,
        objectType: c.RZ_OBJECT_TYPE_COMMERCIAL,
        commercialType: c.RZ_COMMERCIAL_TYPE_RETAIL,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_RETAIL_SALE);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_FREE_PURPOSE_SALE', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_SALE,
        objectType: c.RZ_OBJECT_TYPE_COMMERCIAL,
        commercialType: c.RZ_COMMERCIAL_TYPE_FREE_PURPOSE,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_FREE_PURPOSE_SALE);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_PUBLIC_CATERING_SALE', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_SALE,
        objectType: c.RZ_OBJECT_TYPE_COMMERCIAL,
        commercialType: c.RZ_COMMERCIAL_TYPE_PUBLIC_CATERING,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_PUBLIC_CATERING_SALE);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_AUTO_REPAIR_SALE', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_SALE,
        objectType: c.RZ_OBJECT_TYPE_COMMERCIAL,
        commercialType: c.RZ_COMMERCIAL_TYPE_AUTO_REPAIR,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_AUTO_REPAIR_SALE);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_BUSINESS_SALE', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_SALE,
        objectType: c.RZ_OBJECT_TYPE_COMMERCIAL,
        commercialType: c.RZ_COMMERCIAL_TYPE_BUSINESS,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_BUSINESS_SALE);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_LAND_SALE', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_SALE,
        objectType: c.RZ_OBJECT_TYPE_COMMERCIAL,
        commercialType: c.RZ_COMMERCIAL_TYPE_LAND,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_LAND_SALE);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_HOTEL_SALE', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_SALE,
        objectType: c.RZ_OBJECT_TYPE_COMMERCIAL,
        commercialType: c.RZ_COMMERCIAL_TYPE_HOTEL,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_HOTEL_SALE);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_WAREHOUSE_SALE', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_SALE,
        objectType: c.RZ_OBJECT_TYPE_COMMERCIAL,
        commercialType: c.RZ_COMMERCIAL_TYPE_WAREHOUSE,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_WAREHOUSE_SALE);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_MANUFACTURING_SALE', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_SALE,
        objectType: c.RZ_OBJECT_TYPE_COMMERCIAL,
        commercialType: c.RZ_COMMERCIAL_TYPE_MANUFACTURING,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_MANUFACTURING_SALE);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_FLAT_1_ROOM_RENT', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_RENT,
        objectType: c.RZ_OBJECT_TYPE_FLAT,
        rooms: c.RZ_ROOMS_TYPE_ONE,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_1_ROOM_RENT);

            done();
        });
    });
});


it('RZ_MEGA_CMP_OBJECT_TYPE_FLAT_2_ROOM_RENT', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_RENT,
        objectType: c.RZ_OBJECT_TYPE_FLAT,
        rooms: c.RZ_ROOMS_TYPE_TWO,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_2_ROOM_RENT);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_FLAT_3_ROOM_RENT', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_RENT,
        objectType: c.RZ_OBJECT_TYPE_FLAT,
        rooms: c.RZ_ROOMS_TYPE_THREE,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_3_ROOM_RENT);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_FLAT_4_ROOM_RENT', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_RENT,
        objectType: c.RZ_OBJECT_TYPE_FLAT,
        rooms: c.RZ_ROOMS_TYPE_FOUR,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_4_ROOM_RENT);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_FLAT_5_ROOM_RENT', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_RENT,
        objectType: c.RZ_OBJECT_TYPE_FLAT,
        rooms: c.RZ_ROOMS_TYPE_FIVE,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_5_ROOM_RENT);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_FLAT_STUDIO_ROOM_RENT', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_RENT,
        objectType: c.RZ_OBJECT_TYPE_FLAT,
        rooms: c.RZ_ROOMS_TYPE_STUDIO,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_STUDIO_ROOM_RENT);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_FLAT_OPEN_ROOM_RENT', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_RENT,
        objectType: c.RZ_OBJECT_TYPE_FLAT,
        rooms: c.RZ_ROOMS_TYPE_OPEN,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_OPEN_ROOM_RENT);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_ROOM_RENT', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_RENT,
        objectType: c.RZ_OBJECT_TYPE_ROOM,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_ROOM_RENT);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_HOUSE_RENT', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_RENT,
        objectType: c.RZ_OBJECT_TYPE_HOUSE,
        houseType: c.RZ_HOUSE_TYPE_HOUSE,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_HOUSE_RENT);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_HOUSE_COTTAGE_RENT', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_RENT,
        objectType: c.RZ_OBJECT_TYPE_HOUSE,
        houseType: c.RZ_HOUSE_TYPE_COTTAGE,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_HOUSE_COTTAGE_RENT);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_HOUSE_DACHA_RENT', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_RENT,
        objectType: c.RZ_OBJECT_TYPE_HOUSE,
        houseType: c.RZ_HOUSE_TYPE_DACHA,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_HOUSE_DACHA_RENT);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_HOUSE_TOWNHOUSE_RENT', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_RENT,
        objectType: c.RZ_OBJECT_TYPE_HOUSE,
        houseType: c.RZ_HOUSE_TYPE_TOWNHOUSE,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_HOUSE_TOWNHOUSE_RENT);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_HOUSE_HALF_HOUSE_RENT', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_RENT,
        objectType: c.RZ_OBJECT_TYPE_HOUSE,
        houseType: c.RZ_HOUSE_TYPE_HALF_HOUSE,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_HOUSE_HALF_HOUSE_RENT);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_GARAGE_RENT', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_RENT,
        objectType: c.RZ_OBJECT_TYPE_GARAGE,
        garageType: c.RZ_GARAGE_TYPE_GARAGE,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_GARAGE_RENT);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_GARAGE_PARKING_PLACE_RENT', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_RENT,
        objectType: c.RZ_OBJECT_TYPE_GARAGE,
        garageType: c.RZ_GARAGE_TYPE_PARKING_PLACE,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_GARAGE_PARKING_PLACE_RENT);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_GARAGE_BOX_RENT', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_RENT,
        objectType: c.RZ_OBJECT_TYPE_GARAGE,
        garageType: c.RZ_GARAGE_TYPE_BOX,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_GARAGE_BOX_RENT);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_OFFICE_RENT', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_RENT,
        objectType: c.RZ_OBJECT_TYPE_COMMERCIAL,
        commercialType: c.RZ_COMMERCIAL_TYPE_OFFICE,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_OFFICE_RENT);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_RETAIL_RENT', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_RENT,
        objectType: c.RZ_OBJECT_TYPE_COMMERCIAL,
        commercialType: c.RZ_COMMERCIAL_TYPE_RETAIL,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_RETAIL_RENT);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_FREE_PURPOSE_RENT', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_RENT,
        objectType: c.RZ_OBJECT_TYPE_COMMERCIAL,
        commercialType: c.RZ_COMMERCIAL_TYPE_FREE_PURPOSE,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_FREE_PURPOSE_RENT);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_PUBLIC_CATERING_RENT', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_RENT,
        objectType: c.RZ_OBJECT_TYPE_COMMERCIAL,
        commercialType: c.RZ_COMMERCIAL_TYPE_PUBLIC_CATERING,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_PUBLIC_CATERING_RENT);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_AUTO_REPAIR_RENT', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_RENT,
        objectType: c.RZ_OBJECT_TYPE_COMMERCIAL,
        commercialType: c.RZ_COMMERCIAL_TYPE_AUTO_REPAIR,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_AUTO_REPAIR_RENT);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_BUSINESS_RENT', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_RENT,
        objectType: c.RZ_OBJECT_TYPE_COMMERCIAL,
        commercialType: c.RZ_COMMERCIAL_TYPE_BUSINESS,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_BUSINESS_RENT);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_LEGAL_ADDRESS_RENT', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_RENT,
        objectType: c.RZ_OBJECT_TYPE_COMMERCIAL,
        commercialType: c.RZ_COMMERCIAL_TYPE_LEGAL_ADDRESS,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_LEGAL_ADDRESS_RENT);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_LAND_RENT', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_RENT,
        objectType: c.RZ_OBJECT_TYPE_COMMERCIAL,
        commercialType: c.RZ_COMMERCIAL_TYPE_LAND,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_LAND_RENT);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_HOTEL_RENT', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_RENT,
        objectType: c.RZ_OBJECT_TYPE_COMMERCIAL,
        commercialType: c.RZ_COMMERCIAL_TYPE_HOTEL,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_HOTEL_RENT);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_WAREHOUSE_RENT', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_RENT,
        objectType: c.RZ_OBJECT_TYPE_COMMERCIAL,
        commercialType: c.RZ_COMMERCIAL_TYPE_WAREHOUSE,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_WAREHOUSE_RENT);

            done();
        });
    });
});

it('RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_MANUFACTURING_RENT', done => {
    request.post(CREATE_OBJECT_URL, {
        offerType: c.RZ_OFFER_TYPE_RENT,
        objectType: c.RZ_OBJECT_TYPE_COMMERCIAL,
        commercialType: c.RZ_COMMERCIAL_TYPE_MANUFACTURING,
        price: PRICE,
        description: DESCR,
        geoObl: GEO_OBL,
        geoRaion: GEO_RAION,
        geoLatitude: LAT,
        geoLongitude: LON, status: c.OBJECT_STATUS_PUBLISHED
    }, (err, res, body) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        body = JSON.parse(body);

        objectModel.findOne({_id: body.id}, (err, object) => {
            should.not.exists(err);

            object.megaCompoundType.should.be.equal(c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_MANUFACTURING_RENT);

            done();
        });
    });
});
