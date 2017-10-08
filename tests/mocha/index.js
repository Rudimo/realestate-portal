'use strict';

/**
 * Core assert library
 */
let assert = require('assert');

let should = require('should');

/**
 * Requiring init script for main nodejs-lib
 *
 * @type {exports|module.exports}
 * @private
 */
let _init = require('../common/_init.js');

/**
 * Requiring path utils
 * @type {*}
 */
let path = require('path');

/**
 * Async library
 *
 * @type {async|exports|module.exports}
 */
const async = require('async');

function importTest(name, path) {
    describe(name, function () {
        require(path);
    });
}

describe('Tests', function () {

    before(function (done) {

            async.parallel([callback => {
                _init.startServer(callback);
            }], err => {
                if (err) throw err;

                _init.clearDatabase(done);
            });
        });

    importTest('Authentication', './authentication/authentication.js');
    importTest('User profile', './user/index.js');
    importTest('Change E-mail', './user/change-email');
    importTest('Geocoder', './geocoder/index');
    importTest('Check megaCompoundType', './object/megaCompoundType');
    importTest('Realestate', './realestate/index');

});