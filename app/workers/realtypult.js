'use strict';

const Core = process.mainModule.require('nodejs-lib');

const Importer = require('../libs/realtypult.js');

module.exports = {


    'import': (params, callback) => {

        let importer = new Importer();

        importer.rmImportFeed(callback);

    }
};