'use strict';

/**
 * Requiring base Model
 */
const BaseModel = require('./basemodel.js');

/**
 * Application constants
 * @type {*|exports|module.exports}
 */
const c = require('../constants');

/**
 * Local passport strategy
 */
const LocalStrategy = require('passport-local').Strategy;

/**
 * RandomString library
 * @type {*|exports|module.exports}
 */
const randomString = require('random-string');

/**
 * Bcryptjs library
 *
 * @type {string}
 */
const bcrypt = require('bcryptjs');

/**
 * Async library
 */
const async = require('async');

/**
 * Requiring Core Library
 */
const Core = require('nodejs-lib');

/**
 * fs core module
 */
const fs = require('fs');

/**
 * path core module
 */
const path = require('path');

/**
 * os core module
 */
const os = require('os');

/**
 * moment core module
 */
const moment = require('moment');

/**
 * RandomString module
 *
 * @type {*|exports|module.exports}
 */
const randomstring = require('randomstring');

/**
 * Validation module
 *
 * @type {*|exports|module.exports}
 */
const validator = require('validator');

/**
 * Application mailer
 *
 * @type {Mailer|exports|module.exports}
 */
const Mailer = require('../libs/mailer');

/**
 * ObjectId validator
 */
const ObjectId = require('mongoose').Types.ObjectId;

/**
 * Minimum length us user password
 *
 * @type {number}
 */
const USER_PASSWORD_MIN_LENGTH = 4;

/**
 *  Client model class
 */
class UserModel extends BaseModel {
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

        let Types = this.mongoose.Schema.Types;

        let schemaObject = {

            idNumber: {type: Number, index: {unique: true}},

            firstName: {type: String},
            surName: {type: String},
            lastName: {type: String},

            phone: {type: String, index: true, unique: true, sparse: true},

            email: {type: String, index: true, unique: true, lowercase: true, sparse: true},

            emailVerificationCode: {
                type: String
            },

            emailChangeRequest: {
                toEmail: String,
                confirmationCode1: String,
                confirmationCode2: String,
                requestedAt: Date
            },

            password: {
                type: String
            },

            newsLetter: {type: Boolean, default: true},

            status: {type: Number, 'default': c.USER_STATUS_ACTIVE},

            isAdmin: {type: Boolean, default: false},
            isAgent: {type: Boolean, default: false},

            image: {type: Types.ObjectId, ref: 'image'},

            updatedAt: {type: Date, 'default': Date.now},
            createdAt: {type: Date, 'default': Date.now},
            lastModifiedBy: {type: Types.ObjectId, ref: 'user'}
        };

        // Creating DBO Schema
        let UserDBOSchema = this.createSchema(schemaObject);

        UserDBOSchema.virtual('fullName').get(function () {
            let names = [];

            if (this.firstName) names.push(this.firstName);
            if (this.lastName) names.push(this.lastName);

            return names.join(' ');
        });

        UserDBOSchema.pre('save', function (next) {

            if (this.isNew) {
                this.emailVerificationCode = randomString({
                    length: 20,
                    numeric: true,
                    letters: true,
                    special: false
                });

                if (this.password == c.PASSWORD_AUTO_GENERATE) {
                    this.password = randomString({
                        length: 5,
                        numeric: true,
                        letters: true,
                        special: false
                    });
                }
            }

            next();
        });

        UserDBOSchema.pre('save', function (next) {
            let user = this;

            // only hash the password if it has been modified (or is new)
            if (!user.isModified('password')) return next();

            // generate a salt
            bcrypt.genSalt((err, salt) => {
                if (err) return next(new Error('UserDBOSchema.pre.save.1: ' + err));

                // hash the password using our new salt
                bcrypt.hash(user.password, salt, function (err, hash) {
                    if (err) return next(new Error('UserDBOSchema.pre.save.2: ' + err));

                    // override the cleartext password with the hashed one
                    user.password = hash;
                    next();
                });
            });
        });

        UserDBOSchema.pre('save', function (next) {

            if (!this.phone) return next();

            this.phone = this.phone.replace(/\D/g, '');

            if (this.phone.length > 10) {

                if (this.phone.indexOf('7') !== 0 && this.phone.indexOf('8') !== 0) {
                    return next(new Error('Номер телефона более 10 цифр должен начинаться с 7 или 8.'));
                }

                /**
                 * 79200242211 -> 9200242211
                 * 89200242211 -> 9200242211
                 */
                this.phone = this.phone.substring(this.phone.length - 10, this.phone.length);
            }

            next();
        });

        UserDBOSchema.methods.comparePassword = function (candidatePassword, callback) {
            bcrypt.compare(candidatePassword, this.password, callback);
        };

        // Registering schema and initializing model
        this.registerSchema(UserDBOSchema);
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

        //if (!item.firstName) {
        //    validationMessages.push('User First Name must be specified');
        //}

        validationCallback(Core.ValidationError.create(validationMessages));
    }

    /**
     * Passport instance
     *
     * @returns {*|UserModel.passport}
     */
    get passport() {
        return this._passport;
    }

    /**
     * Registering passport handlers
     *
     * @param passport
     */
    registerPassportHandlers(passport) {
        let userModel = this;

        this._passport = passport;

        this.logger.info('## Registering LocalStrategy for Authentification.');

        passport.serializeUser(function (user, callback) {
            callback(null, user.id);
        });

        passport.deserializeUser((id, callback) => {

            this.model
                .findOne({_id: id})
                .populate('image')
                .exec((err, user) => {
                    if (err) {
                        this.logger.error(err);
                        return callback(err);
                    }

                    callback(null, user);
                });

            //require('./acl_permissions').acl.addUserRoles(user._id.toString(), 'user');
            //
            //if (user.isAdmin) {
            //    require('./acl_permissions').acl.addUserRoles(user._id.toString(), 'admin');
            //}
        });

        /**
         * Sign in using Email and Password.
         */
        passport.use(new LocalStrategy({usernameField: 'username'}, function (username, password, done) {

            let persistUsername = username;

            if (username.indexOf('@') === -1) {
                /**
                 * This is Phone number
                 */
                username = userModel.formatPhone(username);
            } else {
                /**
                 * This is Email address
                 */
                username = username.toLowerCase();
            }

            userModel.logger.debug('Trying to Authentificate user %s.', username);

            userModel.findOne({$or: [{email: username}, {phone: username}]}, function (err, user) {

                if (err) {
                    userModel.logger.error(err);
                    return done(null, false, {message: 'Извините, произошла внутренняя ошибка. Обратитесь в службу поддержки клиентов.'});
                }

                if (!user) {
                    userModel.logger.debug('E-mail or phone "' + persistUsername + '" not found.');
                    return done(null, false, {message: 'E-mail адрес или Номер телефона "' + persistUsername + '" не зарегистрирован.'});
                }

                user.comparePassword(password, function (err, isMatch) {
                    if (err) return done(err);
                    if (isMatch) {
                        return done(null, user);
                    }
                    userModel.logger.debug('Wrong password for: "' + username);
                    done(null, false, {message: 'Неверный пароль.'});
                });
            });
        }));
    }

    /**
     * Register a user
     *
     * @param userData
     * @param userData.firstName
     * @param [userData.lastName]
     * @param userData.email
     * @param userData.phone
     * @param userData.password
     * @param callback
     * @returns {*}
     */
    register(userData, callback) {

        let error;

        if (!userData.firstName || userData.firstName.length < 1) {

            error = `Пожалуйста, введите имя.`;
        }

        if (!userData.email || !validator.isEmail(userData.email)) {

            error = `Пожалуйста, проверьте введенный E-mail адрес.`;
        }

        if (!this.validatePhone(userData.phone)) {

            error = `Пожалуйста, проверьте введенный номер телефона.`;
        }

        if (!userData.password || userData.password.length < USER_PASSWORD_MIN_LENGTH) {

            error = `Длина пароля должна быть как минимум ${USER_PASSWORD_MIN_LENGTH}`;
        }

        if (error) {

            return callback(new Error(error));
        }

        modelInstance.findOne({$or: [{email: userData.email}, {phone: userData.phone}]}, (err, existingUser) => {

            if (existingUser) {

                return callback(new Error('Пользователь с таким E-mail адресом или номером телефона уже зарегистрирован.'));
            }

            modelInstance.insert(userData, (err, user) => {

                if (err) return callback(err);

                callback(null, user);

                Mailer.sendMail({
                    toUserId: user.id,
                    type: c.EMAIL_TYPE_REGISTER
                });
            });
        });
    }

    /**
     * Remove extra charsets from phone
     *
     * @param phone
     * @returns {*}
     */
    formatPhone(phone) {
        if (!phone) return '';

        phone = phone.replace(/\D/g, '');

        if (phone.length > 10) {
            /**
             * 79200242211 -> 9200242211
             * 89200242211 -> 9200242211
             */
            phone = phone.substring(phone.length - 10, phone.length);
        }

        return phone;
    }

    /**
     * Validate phone number
     *
     * @param phone
     * @returns {boolean}
     */
    validatePhone(phone) {
        phone = phone.replace(/\D/g, '');

        if (phone.length > 10) {

            if (phone.indexOf('7') !== 0 && phone.indexOf('8') !== 0) {
                return false;
            }

            return true;

        } else if (phone.length < 10) {
            return false;
        } else {
            return true;
        }
    }
}

/**
 * Creating instance of the model
 */
let modelInstance = new UserModel('user');

/**
 * Exporting Model
 *
 * @type {Function}
 */
module.exports = modelInstance;