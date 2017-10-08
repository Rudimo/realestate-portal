'use strict';

/**
 * Requiring Core Library
 */
const Core = require('nodejs-lib');

/**
 * Requiring base Model
 */
const BaseModel = require('./basemodel.js');

/**
 * Async library
 * @type {async|exports|module.exports}
 */
const async = require('async');

/**
 * Module for parsing multipart-form data requests
 */
const multiparty = require('multiparty');

/**
 * Validator library
 * @type {*|exports|module.exports}
 */
const validator = require('validator');

/**
 * Request library
 * @type {request|exports|module.exports}
 */
const request = require('request');

/**
 * File systems module
 */
const fs = require('fs');

/**
 * Library for generating a slug
 * @type {*|exports|module.exports}
 */
const speakingUrl = require('speakingurl');

/**
 * Core path library
 *
 * @type {posix|exports|module.exports}
 */
const path = require('path');

/**
 * Application downloader
 *
 * @type {Downloader|exports|module.exports}
 */
const Downloader = require('../libs/http/downloader');

/**
 * Application stop list
 *
 * @type {{test: Function, list: Array}}
 */
const stopList = require('../data/stop-list');

/**
 *  Client model class
 */
class ImageModel extends BaseModel {
    /**
     * Model constructor
     */
    constructor(listName) {
        // We must call super() in child class to have access to 'this' in a constructor
        super(listName);
    }

    /**
     * Define Schema
     *
     * @override
     */
    defineSchema() {

        let $this = this;
        let Types = this.mongoose.Schema.Types;

        let schemaObject = {

            title: {type: String},

            containerName: {type: String},

            sourceUrl: {type: String, index: true},

            cdnUrl: {type: String},
            fileName: {type: String},

            thumbnailCdnUrl: {type: String},
            thumbnailFileName: {type: String},

            thumbnailMiniCdnUrl: {type: String},
            thumbnailMiniFileName: {type: String},

            object: {type: Types.ObjectId, index: true, ref: 'object'},

            updatedAt: {type: Date, 'default': Date.now},
            createdAt: {type: Date, 'default': Date.now},
            lastModifiedBy: {type: Types.ObjectId, ref: 'user'}
        };

        // Creating DBO Schema
        let ImageDBOSchema = this.createSchema(schemaObject);

        ImageDBOSchema.pre('remove', function (callback) {

            $this.logger.debug('Destroy image: ', {
                id: this.id,
                containerName: this.containerName,
                fileName: this.fileName
            });

            async.parallel([callback => {
                $this.pkgClient.client.removeFile(this.containerName, this.fileName, err => {
                    if (err) $this.logger.info(err);
                    callback();
                });
            }, callback => {
                if (this.thumbnailFileName) {
                    $this.pkgClient.client.removeFile(this.containerName, this.thumbnailFileName, err => {
                        if (err) $this.logger.info(err);
                        callback();
                    });
                } else {
                    callback();
                }
            }, callback => {
                if (this.thumbnailMiniFileName) {
                    $this.pkgClient.client.removeFile(this.containerName, this.thumbnailMiniFileName, err => {
                        if (err) $this.logger.info(err);
                        callback();
                    });
                } else {
                    callback();
                }
            }], callback);
        });

        // validate text data using stop list
        ImageDBOSchema.pre('save', function (done) {

            /*let stopWord;

            if (this.title) {

                stopWord = stopList.test(this.title);

                if (stopWord) return done(new Core.ValidationError(`Описание к фотографии содержит недопустимое слово "${stopWord}"`));
            }*/

            done();
        });

        // Registering schema and initializing model
        this.registerSchema(ImageDBOSchema);
    }

    /**
     * Validating item before save
     *
     * @param item
     * @param validationCallback
     * @returns {array}
     */
    validate(item, validationCallback) {
        let validationMessages = [];

        //if (!item.token) {
        //    validationMessages.push('Export Feed token must be specified');
        //}

        validationCallback(Core.ValidationError.create(validationMessages));
    }

    /**
     * Get random container for upload objects
     *
     * @returns {{containerName: String}, {containerSubdomain: String}}
     */
    get objectsImagesContainer() {
        if (Core.ApplicationFacade.instance.config.isDev) {
            return {
                containerName: 'rz-objects-images-test',
                containerSubdomain: 'images-test'
            };
        }

        // Using five containers from 10 to 49
        let randomNumber = Math.floor(Math.random() * 40) + 10;

        return {
            containerName: `rz-objects-images-${randomNumber}`,
            containerSubdomain: `images-${randomNumber}`
        };
    }

    /**
     * Get container for upload users images
     *
     * @returns {{containerName: String}, {containerSubdomain: String}}
     */
    get usersImagesContainer() {

        if (Core.ApplicationFacade.instance.config.isDev) {
            return {
                containerName: 'rz-users-images-test',
                containerSubdomain: 'users-images-test'
            };
        }

        return {
            containerName: `rz-users-images`,
            containerSubdomain: 'users-images'
        };
    }

    /**
     * Upload image from request or URL
     * @param callback
     * @param [options.request] - Express request object
     * @param [options.url] - URL of image
     * @param [options.optimizeLocally] - Do optimization locally
     * @param options
     */
    uploadObjectImage(options, callback) {

        options.optimizeLocally = true; // always optimize locally

        //console.log('uploadObjectImage');

        // 1. Parse form, get temp file and name | OR | Get image by url
        // 2. Upload to container
        // 3. Store to database and return instance

        let randomContainer = this.objectsImagesContainer;

        async.waterfall([callback => {

            if (options.request) {
                this.parseForm(options.request, callback);
            } else {
                this.getFromUrl(options.url, callback);
            }

        }, (file, callback) => {

            //this.logger.debug('uploadObjectImage(): file ' + require('util').inspect(file));

            let uploadFilename = speakingUrl(file.fileName, {mark: true});

            async.parallel({
                image: callback => {
                    // Upload main image
                    this.pkgClient.upload(file.path, {
                        containerName: randomContainer.containerName,
                        containerCdn: true,
                        optimize: !options.optimizeLocally,
                        optimizeLocally: options.optimizeLocally,
                        resize: {
                            width: 1024,
                            height: 768,
                            strategy: 'auto'
                        },
                        fileName: 'image-' + uploadFilename
                    }, callback);
                },
                thumbnail: callback => {
                    // Create thumbnail
                    this.pkgClient.upload(file.path, {
                        containerName: randomContainer.containerName,
                        containerCdn: true,
                        optimize: !options.optimizeLocally,
                        optimizeLocally: options.optimizeLocally,
                        resize: {
                            width: 250,
                            height: 200,
                            strategy: 'auto'
                        },
                        fileName: 'thumbnail-' + uploadFilename
                    }, callback);
                },
                thumbnailMini: callback => {
                    // Create thumbnail
                    this.pkgClient.upload(file.path, {
                        containerName: randomContainer.containerName,
                        containerCdn: true,
                        optimize: !options.optimizeLocally,
                        optimizeLocally: options.optimizeLocally,
                        resize: {
                            width: 60,
                            height: 30,
                            strategy: 'auto'
                        },
                        fileName: 'thumbnail-mini-' + uploadFilename
                    }, callback);
                }
            }, (err, results) => {
                if (err) return callback(err);

                //console.log(results.image);

                callback(null, file, {
                    sourceUrl: options.url ? options.url : undefined,

                    cdnUrl: this.obtainCndUrl(randomContainer, results.image.cdnUrl),
                    fileName: results.image.fileName,

                    thumbnailCdnUrl: this.obtainCndUrl(randomContainer, results.thumbnail.cdnUrl),
                    thumbnailFileName: results.thumbnail.fileName,

                    thumbnailMiniCdnUrl: this.obtainCndUrl(randomContainer, results.thumbnailMini.cdnUrl),
                    thumbnailMiniFileName: results.thumbnailMini.fileName,

                    containerName: randomContainer.containerName
                });
            });

        }, (file, image, callback) => {

            fs.unlink(file.path, err => {
                if (err) this.logger.error(err);

                this.insert(image, callback);
            });

        }], callback);
    }

    /**
     * Upload user avatar from request or URL
     * @param callback
     * @param [options.request] - Express request object
     * @param [options.url] - URL of image
     * @param options
     */
    uploadUserImage(options, callback) {

        // 1. Parse form, get temp file and name | OR | Get image by url
        // 2. Upload to container
        // 3. Store to database and return instance

        options.optimizeLocally = true; // always optimize locally

        let randomContainer = this.usersImagesContainer;

        async.waterfall([callback => {

            if (options.request) {
                this.parseForm(options.request, callback);
            } else {
                this.getFromUrl(options.url, callback);
            }

        }, (file, callback) => {

            let fileName = speakingUrl(file.fileName, {mark: true});

            // Upload main image
            this.pkgClient.upload(file.path, {
                containerName: randomContainer.containerName,
                containerCdn: true,
                optimize: !options.optimizeLocally,
                optimizeLocally: options.optimizeLocally,
                resize: {
                    width: 260,
                    height: 260,
                    strategy: 'auto'
                },
                fileName: fileName
            }, (err, image) => {
                if (err) return callback(err);

                callback(null, file, {
                    cdnUrl: this.obtainCndUrl(randomContainer, image.cdnUrl),
                    fileName: image.fileName,
                    containerName: randomContainer.containerName
                });
            });

        }, (file, image, callback) => {

            fs.unlink(file.path, err => {
                if (err) this.logger.error(err);

                this.insert(image, callback);
            });

        }], callback);
    }

    /**
     * Parse HTTP form data and return temp file path
     * @param request
     * @param callback
     */
    parseForm(request, callback) {
        let form = new multiparty.Form();

        //console.log('Start parsing');

        form.parse(request, (err, fields, files) => {
            if (err) return callback(err);

            if (!files.file || !files.file[0]) {
                return callback(new Error('No file uploaded'));
            }

            //console.log('Form parsed');

            callback(null, {
                path: files.file[0].path,
                fileName: files.file[0].originalFilename // !!! It's not originalFile>>>N<<<ame
            });
        });
    }

    /**
     * Get file from URL
     * @param url
     * @param callback
     */
    getFromUrl(url, callback) {

        if (!url || !validator.isURL(url)) {
            callback(new Error('Invalid URL: ' + url));
        }

        //this.logger.log('getFromUrl(): url = ' + url);
        //this.logger.log('getFromUrl(): fileName = ' + fileName);

        Downloader.download({
            url: url,
            allowedMimes: ['image/jpeg'],
            maxSizeInMb: 10,
            timeoutInSec: 5
        }, (err, file) => {
            if (err) return callback(err);

            callback(null, {
                path: file.path,
                fileName: url.split('/').pop()
            });
        });
    }

    /**
     * Obtain CDN url by CDN domain and file name
     *
     * @param containerData
     * @param cdnUrl
     *
     * @returns {string}
     */
    obtainCndUrl(containerData, cdnUrl) {

        return cdnUrl;

        if (Core.ApplicationFacade.instance.config.isDev) {

            return cdnUrl;
        }

        return cdnUrl.replace(/http(s)?:\/\/.*\//, `https://${containerData.containerSubdomain}.realza.ru/`);
    }

    /**
     * Do not index this collection
     *
     * @override
     * @param callback
     */
    defineMapping(callback) {
        if (callback) callback();
    }
}

/**
 * Creating instance of the model
 */
let modelInstance = new ImageModel('image');

/**
 * Exporting Model
 *
 * @type {Function}
 */
module.exports = modelInstance;