'use strict';

class BaseError extends Error {

    constructor(message) {

        super(message);

        this.shouldBeHandled = true;
    }
}

module.exports = BaseError;