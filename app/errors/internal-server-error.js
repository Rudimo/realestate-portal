'use strict';

/**
 * Base Error
 *
 * @type {BaseError}
 */
const BaseError = require('./base');

class InternalServerError extends BaseError {

    constructor(message) {

        super(message || '500 - Ошибка на сервере');

        //noinspection JSUnresolvedVariable
        this.name = 'InternalServerError';
        this.code = 500;

        this.viewPath = 'app/views/site/errors/500-internal-server-error.swig';
    }
}

/**
 * Export error class
 *
 * @type {InternalServerError}
 */
module.exports = InternalServerError;