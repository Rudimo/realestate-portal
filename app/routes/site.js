'use strict';

module.exports = function () {

    return {
        'get|/': 'site/index.js',

        'get,post|/signup': 'site/signup.js',
        'get,post|/signin': 'site/signin.js',

        'get|/logout': 'site/logout.js',

        'get|/confirm-email/:code': 'site/confirm-email.js',
        'get|/change-email-verification/:code': 'site/change-email-verification.js',

        //'get|/objects': 'site/object.js',
        //'get|/objects/page/:page': 'site/object.js',
        'get,post|/objects/:action': 'site/object.js',
        //'get,post|/objects/:id/:action': 'site/object.js',

        'get|/user/objects': 'site/user/object.js',
        'get|/user/objects/page/:page': 'site/user/object.js',
        'get,post|/user/objects/:action': 'site/user/object.js',
        'get,post|/user/objects/:id/:action': 'site/user/object.js',

        'get|/user/setting': 'site/user/setting.js',
        'get,post|/user/setting/:action': 'site/user/setting.js',

        // Other
        'post|/image': 'site/image.js', // TODO: User must be logged in

        'get|/geocoder': 'site/geocoder.js',

        'get|/robots.txt': 'site/robots.js',

        'get|/raions': 'site/realestate/raions.js',
        'get|/regions': 'site/realestate/regions.js',
        'get|/:param2?/:param3?/:param4?/:param5?/:param6?/:param7?': 'site/realestate/index.js',

        'get|/legal/rules': 'site/legal/rules.js',
        'get|/legal/personal-data': 'site/legal/personal-data.js',

        'get,post|/contacts': 'site/contacts.js',
    };
};