'use strict';

/**
 * Base Error
 *
 * @type {BaseError}
 */
const BaseError = require('./base');

class ObjectHasGoneError extends BaseError {

    constructor(message) {

        super(message || '410 - Объявление было удалено');

        //noinspection JSUnresolvedVariable
        this.name = 'ObjectHasGoneError';
        this.code = 410;

        this.viewPath = 'app/views/site/errors/410-object-has-gone.swig';
    }
}

/**
 * Export error class
 *
 * @type {ObjectHasGoneError}
 */
module.exports = ObjectHasGoneError;