'use strict';

/**
 * RandomString library
 * @type {*|exports|module.exports}
 */
const randomString = require('random-string');

/**
 * Should library
 *
 * @type {should|exports|module.exports}
 */
const should = require('should');

/**
 * Request helper
 * @type {Request|exports|module.exports}
 */
const request = require('./_request');

//let queueTaskModel = require('../../app/models/queue_task').model;

module.exports = {
    /**
     * New user sign up
     *
     * @param options
     * @param options.email
     * @param [options.firstName]
     * @param [options.phone]
     * @param options.password
     * @param done
     */
    signUp: (options, done) => {
        request.post('/signup', {
            email: options.email,
            firstName: options.firstName || 'Иван',
            phone: options.phone || randomString({
                length: 10,
                numeric: true,
                letters: false,
                special: false
            }),
            password: options.password,
            password2: options.password,
            isAgent: 'on',
            terms: 'on'
        }, (err, res, body, $) => {
            should.not.exists(err);
            res.statusCode.should.equal(200);

            $('*:contains(Аккаунт был успешно создан)').text().should.be.ok();
            done();
        });
    },
    /**
     * New partner user sign up
     *
     * @param options
     * @param options.email
     * @param [options.firstName]
     * @param [options.lastName]
     * @param [options.phone]
     * @param options.password
     * @param done
     */
    /*partnerSignUp: (options, done) => {
        request.post('/partner/signup', {
            email: options.email,
            firstName: options.firstName || 'Иван',
            lastName: options.lastName || 'Васильев',
            password: options.password,
            password2: options.password,
            rulesAccepted: 'on'
        }, (err, res, body, $) => {
            should.not.exists(err);
            res.statusCode.should.equal(200);

            $('*:contains(Добро пожаловать в панель партнера)').text().should.be.ok();
            $('span.role:contains(Партнер)').text().should.be.ok();
            done();
        });
    },*/
    /**
     * User sign up
     *
     * @param options
     * @param options.email
     * @param options.password
     * @param done
     */
    signIn: (options, done) => {
        request.post('/signin', {username: options.email, password: options.password}, (err, res, body, $) => {
            should.not.exists(err);
            res.statusCode.should.equal(200);

            $('li.active > a:contains(ОБЪЯВЛЕНИЯ)').text().should.be.ok();
            done();
        });
    },
    signOut: done => {
        request.get('/logout', function (err, res, body, $) {
            should.not.exists(err);
            res.statusCode.should.equal(200);

            done();
        });
    },
    waitForQueueDrain: (options, callback) => {

        if (typeof options === 'function') {

            callback = options;
            options  = {};
        }

        options.timeout = options.timeout ? options.timeout : 60000; // 60 sec by default

        let handle = setInterval(() => {

            queueTaskModel.find({}, (err, items) => {
                if (err) return callback(err);

                if (items.length === 0) {

                    clearInterval(handle);
                    handle = null;

                    if (options.postDelay) {

                        // Useful for waiting for ES indexing/removing
                        setTimeout(() => {
                            callback();
                        }, options.postDelay);

                    } else {

                        callback();
                    }
                }
            });

        }, 100);

        setTimeout(() => {

            if (handle) {

                clearInterval(handle);
                handle = null;

                callback(new Error(`Unable to wait for queue drain. ${options.timeout} ms. timer expired.`));
            }

        }, options.timeout);
    }
};