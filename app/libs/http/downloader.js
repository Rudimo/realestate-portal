'use strict';

/**
 * Requiring Core Library
 */
const Core = require('nodejs-lib');

/**
 * Async module
 *
 * @type {async|exports|module.exports}
 */
const async = require('async');

/**
 * os core library
 *
 * @type {exports|module.exports}
 */
const os = require('os');

/**
 * fs core library
 *
 * @type {exports|module.exports}
 */
const fs = require('fs');

/**
 * Core path library
 *
 * @type {posix|exports|module.exports}
 */
const path = require('path');

/**
 * mime lookup helper
 *
 * @type {Mime|*|exports|module.exports}
 */
const mime = require('mime');

/**
 * util module
 *
 * @type {exports|module.exports}
 */
const util = require('util');

/**
 * Request module
 *
 * @type {request|exports|module.exports}
 */
const request = require('request');

/**
 * RandomString module
 *
 * @type {*|exports|module.exports}
 */
const randomstring = require('randomstring');

/**
 * Application constants
 * @type {*|exports|module.exports}
 */
const c = require('../../constants');

/**
 * FileSize library
 *
 * @type {filesize|exports|module.exports}
 */
const filesize = require('filesize');

/**
 * String validator
 *
 * @type {*|exports|module.exports}
 */
const validator = require('validator');

/**
 * Application logger
 *
 * @type {*|exports|module.exports}
 */
let logger = Core.ApplicationFacade.instance.logger;

class Downloader {

    /**
     * Download file by URL
     *
     * @param options
     * @param options.url {string} - URL
     * @param [options.allowedMimes] {string} - allowed mime types
     * @param [options.maxSizeInMb] {number} - max size to download in megabytes
     * @param [options.timeoutInSec] {number} - max time to download in seconds
     * @param [options.skipHeadRequest] {boolean} - skip HEAD request and validation
     * @param callback {function} - callback function
     */
    static download(options, callback) {

        if (!options.url || !validator.isURL(options.url, {protocols: ['http', 'https']})) {
            return callback(new Error(`Downloader: invalid URL "${options.url}"`));
        }

        let fileInfo = {};
        let downloadPath;
        let tmpDownloadDir;

        options.maxSizeInMb = options.maxSizeInMb || 128;

        let requestHeaders = {
            'User-Agent': c.RZ_USER_AGENT_STRING
        };

        if (options.allowedMimes && options.allowedMimes.length > 0) {
            requestHeaders.Accept = options.allowedMimes.join(',');
        }

        let timeout = (options.timeoutInSec || 60) * 1000;

        async.series([callback => {

            // Step 1: Validate headers

            if (options.skipHeadRequest) return callback();

            request({
                method: 'HEAD',
                url: options.url,
                headers: requestHeaders,
                timeout: timeout
            }, (err, response) => {
                if (err) return callback(err);

                if (response.statusCode != 200) {
                    return callback(new Error('status code is ' + response.statusCode));
                }

                if (options.allowedMimes && options.allowedMimes.length > 0) {

                    if (response.headers['content-length']) {

                        options.allowedMimes.push('application/octet-stream'); // ?

                        if (options.allowedMimes.indexOf(response.headers['content-type']) == -1) {
                            return callback(new Error('content-type type "' + response.headers['content-type'] +
                                '" is not allowed for download. Allowed types: ' + util.inspect(options.allowedMimes)));
                        }
                    } else {
                        logger.info('Downloader: content-type is not defined for URL ' + options.url);
                    }
                }

                if (options.maxSizeInMb) {

                    if (response.headers['content-length']) {
                        if (+response.headers['content-length'] > (options.maxSizeInMb * 1024 * 1024)) {
                            return callback(new Error('File size ' + filesize(response.headers['content-length']) +
                                ' is not allowed for download. Allowed max size is ' + options.maxSizeInMb + ' MB'));
                        }
                    } else {
                        logger.info('Downloader: content-length is not defined for URL ' + options.url);
                    }
                }

                callback();
            });

        }, callback => {

            // Step 2.0 Check tmp directory

            if (options.tmpPath) return callback();

            if (Core.ApplicationFacade.instance.config.isDev) {

                tmpDownloadDir = os.tmpdir();

                callback();

            } else {

                tmpDownloadDir = '/tmp/downloader';

                fs.stat(tmpDownloadDir, (err, stats) => {
                    if (err) {
                        fs.mkdir(tmpDownloadDir, callback);
                    } else {
                        callback();
                    }
                });
            }

        }, callback => {

            // Step 2: Download file

            downloadPath = options.tmpPath || path.join(tmpDownloadDir, randomstring.generate(25));

            let file = fs.createWriteStream(downloadPath);

            let error          = null;
            let callbackCalled = false;

            file.on('finish', () => {

                if (!callbackCalled) {
                    callback(error);
                }
            });

            file.on('error', err => {

                callbackCalled = true;
                callback(err);
            });

            request({
                method: 'GET',
                url: options.url,
                headers: requestHeaders,
                timeout: timeout
            }).on('error', err => {
                error = err;
                file.end();
            }).pipe(file);

        }, callback => {

            // Step 3: Validate file content

            if (options.allowedMimes && options.allowedMimes.length > 0) {
                let fileMime = mime.lookup(downloadPath);

                if (options.allowedMimes.indexOf(fileMime) == -1) {
                    return callback(new Error('mime type "' + fileMime +
                        '" is not allowed for download. Allowed types: ' + util.inspect(options.allowedMimes)));
                }

                callback();
            } else {
                callback();
            }

        }, callback => {

            // Step 4: Get file info

            fs.stat(downloadPath, (err, stats) => {
                if (err) return callback(new Error('Downloader: unable to stat downloaded file. ' + err.message));

                if (options.maxSizeInMb && options.maxSizeInMb < stats.size / (1024 * 1024)) {

                    return callback(new Error(`Downloader:: size is too big ${stats.size / (1024 * 1024)} MB, allowed ${options.maxSizeInMb}`));
                }

                fileInfo.size = stats.size;

                callback();
            });

        }], err => {
            if (err) {
                // Cleanup: Remove tmp file

                if (downloadPath) {
                    fs.stat(downloadPath, (err, stats) => {
                        if (err) return logger.error('Downloader: unable to stat downloaded file. ' + err.message);

                        if (stats.isFile()) {
                            fs.unlink(downloadPath, (err) => {
                                if (err) return logger.error('Downloader: unable to unlink downloaded file. ' + err.message);
                            });
                        } else {
                            logger.error('Downloader: File was not exist, nothing to remove.');
                        }
                    });
                }

                if (err.message.indexOf('is not allowed for download') > -1) {

                    // ignore "mime type "application/octet-stream" is not allowed for download. Allowed types: [ 'image/jpeg' ]."

                } else if (err.message.indexOf('status code is 40') > -1) {

                    // ignore 40* error

                } else if (err.message.indexOf('status code is 50') > -1) {

                    // ignore 50* error

                } else if (err.message.indexOf('unable to verify') > -1) {

                    logger.debug('Downloader: ' + err.message + '.\r\n' + util.inspect({options: options}));

                } else if (err.message.indexOf('ETIMEDOUT') > -1) {

                    logger.debug('Downloader: ' + err.message + '.\r\n' + util.inspect({options: options}));

                } else if (err.message.indexOf('ENOTFOUND') > -1) {

                    logger.debug('Downloader: ' + err.message + '.\r\n' + util.inspect({options: options}));

                } else if (err.message.indexOf('EAI_AGAIN') > -1) {

                    logger.debug('Downloader: ' + err.message + '.\r\n' + util.inspect({options: options}));

                } else if (err.message.indexOf('ESOCKETTIMEDOUT') > -1) {

                    logger.debug('Downloader: ' + err.message + '.\r\n' + util.inspect({options: options}));

                } else if (err.message.indexOf('ECONNREFUSED') > -1) {

                    logger.debug('Downloader: ' + err.message + '.\r\n' + util.inspect({options: options}));

                } else if (err.message.indexOf('ECONNRESET') > -1) {

                    logger.debug('Downloader: ' + err.message + '.\r\n' + util.inspect({options: options}));

                } else {

                    logger.warning('Downloader: file download failed. "' + downloadPath + '" ' +
                        err.message + '.\r\n' + util.inspect({options: options}));
                }

                if (err.code == 'ENOMEM') {
                    const spawn = require('child_process').spawn;
                    const du    = spawn('df', ['/']);

                    du.stdout.on('data', data => {
                        logger.error(`du, stdout: ${data}`);
                    });

                    du.stderr.on('data', data => {
                        logger.error(`du, stderr: ${data}`);
                    });

                    du.on('close', code => {
                        logger.error(`du, child process exited with code ${code}`);
                    });
                }

                callback(err);

                return;
            }

            fileInfo.path = downloadPath;
            fileInfo.mime = mime.lookup(downloadPath);

            callback(null, fileInfo);
        });
    }
}

/**
 * Export class
 *
 * @type {Downloader}
 */
module.exports = Downloader;