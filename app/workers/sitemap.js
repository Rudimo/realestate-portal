'use strict';

const Core = process.mainModule.require('nodejs-lib');

const SiteMap = require('../libs/sitemap.js');

module.exports = {


    'generate': (params, callback) => {

        let sitemap = new SiteMap();

        sitemap.generateSitemap(callback);

    }
};