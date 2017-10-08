'use strict';

/**
 * Request library
 * @type {request|exports|module.exports}
 */
let request = require('request').defaults({jar: true});

/**
 * HTML parser
 *
 * @type {*|exports|module.exports}
 */
const cheerio = require('cheerio');

class Request {
    static get(url, callback) {
        request.get({
            url: 'http://localhost:' + process.env.SERVER_PORT + url,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.71 Safari/537.36'
            },
            followAllRedirects: true
        }, (err, res, body) => {
            if (err) return callback(err);

            let $ = cheerio.load(body, {decodeEntities: false});

            callback(err, res, body, $)
        });
    }

    static getAnyUrl(url, callback) {
        request.get({
            url: url,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.71 Safari/537.36'
            },
            followAllRedirects: true
        }, (err, res, body) => {
            if (err) return callback(err);

            let $ = cheerio.load(body, {decodeEntities: false});

            callback(err, res, body, $)
        });
    }

    static post(url, data, callback) {
        request.post({
            url: 'http://localhost:' + process.env.SERVER_PORT + url,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.71 Safari/537.36'
            },
            form: data,
            followAllRedirects: true
        }, (err, res, body) => {
            if (err) return callback(err);

            let $ = cheerio.load(body, {decodeEntities: false});

            callback(err, res, body, $)
        });
    }

    static postFormData(url, formData, callback) {
        request.post({
            url: 'http://localhost:' + process.env.SERVER_PORT + url,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.71 Safari/537.36'
            },
            formData: formData,
            followAllRedirects: true
        }, (err, res, body) => {
            if (err) return callback(err);

            let $ = cheerio.load(body, {decodeEntities: false});

            callback(err, res, body, $)
        });
    }
}

exports = module.exports = Request;