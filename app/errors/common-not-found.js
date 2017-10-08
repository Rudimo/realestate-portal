'use strict';

/**
 * Base Error
 *
 * @type {BaseError}
 */
const BaseError = require('./base');

class CommonNotFoundError extends BaseError {

    constructor(message) {

        super(message || '404 - Страница не найдена');

        //noinspection JSUnresolvedVariable
        this.name = 'CommonNotFoundError';
        this.code = 404;

        this.viewPath = 'app/views/site/errors/404-common.swig';
    }
}

/**
 * Export error class
 *
 * @type {CommonNotFoundError}
 */
module.exports = CommonNotFoundError;