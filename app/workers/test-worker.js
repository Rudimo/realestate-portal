'use strict';

module.exports = {


    'test-worker': (params, callback) => {

            setTimeout(() => {
                console.log('Hello');
                callback();
            }, 2000)

    }
};