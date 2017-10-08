'use strict';

const Core               = require('nodejs-lib');
const BaseSiteController = require('./base.js');
const _                  = require('lodash');
const merge              = require('merge');
const regions            = require('../../data/region');

class RobotsTxtController extends BaseSiteController {

    constructor(request, response, next) {
        // We must call super() in child class to have access to 'this' in a constructor
        super(request, response, next);

        /**
         * Is this controller should handle subdomains? Yes
         *
         * @type {boolean}
         * @private
         */
        this._subDomainAllowedForController = true;
    }

    /**
     * Get region
     *
     * @returns {*}
     */
    get region() {

        return _.find(regions, {abbreviation: this.data.meta.subDomain});
    }

    /**
     * Load view file
     *
     * @param callback
     */
    load(callback) {
        super.load(err => {
            if (err) return callback(err);

            this.terminate();

            this.response.setHeader('content-type', 'text/plain');

            let disallowed = [
                '/user/',
                '/logout',
                '/admin',
                '/legal',
                '/confirm-email',
                '/change-email-verification',
                '/cdn-cgi/l/email-protection',
                '/plugins',
            ];

            let disallowedRules = '';

            disallowed.forEach(path => {
                disallowedRules += `Disallow: ${path}\r\n`;
            });

            if (this.region) {
                this.response.send(
                    `User-agent: Yandex\r\n\r\n` +
                    `Allow: /\r\n` +
                    disallowedRules +
                    `\r\n` +
                    // `Disallow: /\r\n` +
                    // `\r\n` +

                    `User-agent: Googlebot\r\n\r\n` +
                    `Allow: /\r\n` +
                    disallowedRules +
                    `\r\n` +
                    // `Disallow: /\r\n` +
                    // `\r\n` +

                    // `User-agent: AhrefsBot\r\n\r\n` +
                    // `Disallow: /\r\n` +
                    // `\r\n` +

                    `User-agent: *\r\n\r\n` +
                    `Allow: /\r\n` +
                    disallowedRules +
                    `\r\n\r\n` +
                    `Sitemap: https://${this.region.abbreviation}.realza.ru/sitemap/${this.region.abbreviation}-sitemap.xml\r\n` +
                    `Host: https://${this.region.abbreviation}.realza.ru`
                    // `Disallow: /\r\n` +
                    // `\r\n`
                );
            } else {
                this.response.send(
                    `User-agent: Yandex\r\n\r\n` +
                    `Allow: /\r\n` +
                    //`Allow: /objects/create\r\n` +
                    disallowedRules +
                    `\r\n` +

                    `User-agent: Googlebot\r\n\r\n` +
                    `Allow: /\r\n` +
                    //`Allow: /objects/create\r\n` +
                    disallowedRules +
                    `\r\n` +

                    // `User-agent: AhrefsBot\r\n\r\n` +
                    // `Disallow: /\r\n` +
                    // `\r\n` +

                    `User-agent: *\r\n\r\n` +
                    //`Allow: /objects/create\r\n` +
                    `Allow: /\r\n` +
                    disallowedRules +
                    `\r\n\r\n` +
                    `Sitemap: https://realza.ru/sitemap/sitemap.xml\r\n` +
                    `Host: https://realza.ru`
                );
            }

            callback();
        });
    }
}

/**
 * Exporting Controller
 *
 * @type {Function}
 */
module.exports = (request, response, next) => {
    let controller = new RobotsTxtController(request, response, next);
    controller.run();
};