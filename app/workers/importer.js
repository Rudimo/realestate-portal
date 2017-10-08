'use strict';

const Core = process.mainModule.require('nodejs-lib');

const Importer = require('../libs/importer.js');

module.exports = {


    'download': (params, callback) => {

        let importer = new Importer();

        importer.doImportFeed(callback);

    }
};