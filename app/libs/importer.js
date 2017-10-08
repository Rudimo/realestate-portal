'use strict';

/**
 * Requiring Core Library
 */
const Core = require('nodejs-lib');

/**
 * fs core module
 *
 * @type {exports|module.exports}
 */
const fs = require('fs');

/**
 * os core library
 *
 * @type {exports|module.exports}
 */
const os = require('os');

/**
 * RandomString module
 *
 * @type {*|exports|module.exports}
 */
const randomstring = require('randomstring');

/**
 * Async module
 *
 * @type {async|exports|module.exports}
 */
const async = require('async');

/**
 * Core path library
 *
 * @type {exports|module.exports}
 */
const path = require('path');

/**
 * Requiring core Events module
 */
const events = require('events');

/**
 * Application constants
 * @type {*|exports|module.exports}
 */
const c = require('../constants');

/**
 * Util library
 *
 * @type {exports|module.exports}
 */
const util = require('util');

/**
 * Moment library
 *
 * @type {*|exports|module.exports}
 */
const moment = require('moment');

/**
 * Lodash library
 *
 * @type {_|exports|module.exports}
 * @private
 */
const _ = require('lodash');


/**
 * Application downloader
 *
 * @type {Downloader|exports|module.exports}
 */
const Downloader = require('./http/downloader');

const xml2js = require('xml2js');

/**
 * File checksumm calculation
 *
 * @type {checksum|exports|module.exports}
 */
const checksum = require('checksum');

/**
 * Importer class
 */
class Importer {

    /**
     * Importer constructor
     */
    constructor() {

        /** Feed to process */
        this.importFeed = null;

        /** Import Feed Model */
        this.importFeedModel = require('../models/import_feed.js');

        /** Was file modified or not */
        this.fileWasNotChanged = false;

        this._logger = Core.ApplicationFacade.instance.logger;

    }

    /**
     * Application logged getter
     *
     * @returns {*|exports|module.exports}
     */
    get logger() {
        return this._logger;
    }

    doImportFeed(callback) {
        async.series([callback => {

            this.getFeed(callback);

        },callback => {

            this.downloadXmlFeed(callback);

        }, callback => {

            this.checkAndUpdateXmlFileCheckSum(callback);

        }, callback => {

            this.convertXmlFeed(callback);

        }, callback => {

            this.parseFeed(callback);

        }], err => {
            if (err) this.logger.error(err);

            callback();
        })
    }

    /** Получаем запись фида из коллекции */
    getFeed(callback) {
        this.importFeedModel.findOne({portalName: 'realtypult'}, (err, feed) => {
            if (err) {
                this.logger.error(err);
                return callback(err);
            }

            console.log(feed);
            this.feed = feed;

            callback();
        })
    }

    /** Скачиваем фид */
    downloadXmlFeed(callback) {

        this.logger.info(`Importer::downloadXmlFeed: get feed by url: ${this.feed.url}`);

        Downloader.download({
            url: this.feed.url,
            allowedMimes: ['text/xml', 'application/xml', 'application/octet-stream'],
            maxSizeInMb: 64,
            skipHeadRequest: true
        }, (err, file) => {
            if (err) return callback(err);

            this.logger.info(`Importer::downloadXmlFeed: download finished`);

            this.downloadedFeed = file;

            callback();
        });
    }

    /** Проверяем чек-сумму фида */
    checkAndUpdateXmlFileCheckSum(callback) {

        checksum.file(this.downloadedFeed.path, (err, sum) => {
            if (err) return callback(err);

            if (this.feed.checksum == sum) {

                // XML файл не был изменен с момента последней загрузки
                this.fileWasNotChanged = true;

            } else {

                this.feed.checksum = sum;
            }

            callback();
        });
    }

    convertXmlFeed(callback) {
        //console.log(this.downloadedFeed);

        let parser = new xml2js.Parser();

        fs.readFile(this.downloadedFeed.path, (err, data) => {
            parser.parseString(data, (err, result) => {

                this.importFeed = result.root.object;
                callback();
            });
        });
    }

    parseFeed(callback) {

        console.log(this.importFeed);
        callback();
    }
}

/**
 * Exporting Model
 *
 * @type {Function}
 */
module.exports = Importer;
