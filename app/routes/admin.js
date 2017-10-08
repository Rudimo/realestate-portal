'use strict';

module.exports = function () {

    return {
        'get|/admin': 'admin/index.js',

        'get|/admin/objects': 'admin/object.js',
        'get|/admin/objects/page/:page': 'admin/object.js',
        'get|/admin/objects/:action': 'admin/object.js',
        'get,post|/admin/objects/:action': 'admin/object.js',
        'get,post|/admin/objects/:id/:action': 'admin/object.js',

        'get,post|/admin/import_feeds/:action': 'admin/import_feed.js',
        'get,post|/admin/import_feeds/:id/:action': 'admin/import_feed.js',
    };
};