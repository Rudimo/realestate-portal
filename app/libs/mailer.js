'use strict';

/**
 * Core library
 */
const Core = require('nodejs-lib');

/**
 * Core mailer
 *
 * @type {*}
 */
const mailer = new Core.MailerSendPulse();

/**
 * Application constants
 * @type {*|exports|module.exports}
 */
const c = require('../constants');

/**
 * SWIG template library
 *
 * @type {*|exports|module.exports}
 */
const swig = require('swig-templates');

/**
 * Path core module
 *
 * @type {posix|exports|module.exports}
 */
const path = require('path');

/**
 * Async library
 *
 * @type {async|exports|module.exports}
 */
const async = require('async');

/**
 * RandomString library
 * @type {*|exports|module.exports}
 */
const randomString = require('random-string');

const fromName  = 'Realza.ru';
const fromEmail = 'mail@realza.ru';
const baseUrl   = Core.ApplicationFacade.instance.config.env.BASE_URL;

class Mailer {

    /**
     * Send prepared message to user
     *
     * @param messageOptions
     * @param [messageOptions.toEmail] string - specify E-mail address for this message (will overwrite user.email address)
     * @param messageOptions.subject
     * @param messageOptions.html
     * @param messageOptions.token
     * @param user
     * @param callback
     */
    static doSendMail(messageOptions, user, callback) {

        let emailModel = require('../models/email');
        let toEmail    = messageOptions.toEmail || user.email;

        let email = new emailModel.model({
            toEmail: toEmail,
            subject: messageOptions.subject,
            html: messageOptions.html,
            token: messageOptions.token,
            user: user.id
        });

        email.save(err => {
            if (err) Core.ApplicationFacade.instance.logger.error(`Mailer::sendMail: ${err.message}`);
        });

        // uncomment for local testing
        if (Core.ApplicationFacade.instance.config.isDev) {
            Core.ApplicationFacade.instance.logger.debug('Mailer::doSendMail Do not send mail in Dev environment');

            return callback();
        }

        Core.ApplicationFacade.instance.logger.debug('Mailer::doSendMail "' + messageOptions.subject + '" to user.email');

        mailer.send([{name: user.firstName, email: toEmail}], messageOptions.html, {
            subject: messageOptions.subject,
            fromName: fromName,
            fromEmail: fromEmail
        }, callback);
    }

    /**
     * Send E-mail message
     *
     * @param options
     * @param options.toUserId
     * @param options.type
     * @param [options.data]
     * @param [options.toEmail] string - specify E-mail address for this message (will overwrite user.email address)
     *
     * @param callback
     */
    static sendMail(options, callback) {
        if (typeof callback != 'function') callback = function (err) {
            if (err) Core.ApplicationFacade.instance.logger.error(`Mailer::sendMail: ${err.message}`);
        };

        if (!options.toUserId) return callback(new Error('sendMail: options.toUserId is required'));
        if (!options.type) return callback(new Error('sendMail: options.type is required'));

        let message = Mailer.getMessage(options.type);

        if (!message.template) {
            Core.ApplicationFacade.instance.logger.error(`Mailer::sendMail: template was not found for ${options.type}`);
            return callback(new Error('sendMail: template was not found'));
        }

        async.waterfall([callback => {

            let userModel = require('../models/user');

            userModel.findById(options.toUserId, (err, user) => {
                if (err) return callback(err);
                if (!user) return callback(new Error('User not found'));

                // TODO: Check subscription

                callback(null, user);
            });

        }, (user, callback) => {

            let token = randomString({
                length: 20,
                numeric: true,
                letters: true,
                special: false
            });

            let html = message.template({
                user: user,
                baseUrl: baseUrl,
                token: token,
                data: options.data ? options.data : {}
            });

            Mailer.doSendMail({
                toEmail: options.toEmail,
                subject: message.subject,
                html: html,
                token: token
            }, user, err => {
                if (err) {
                    Core.ApplicationFacade.instance.logger.error(`Mailer::sendMail: ${err.message}`);
                }

                console.log('sent!');
                callback();
            });

        }], callback);
    }

    /**
     * Load template file
     *
     * @param type
     * @returns {*}
     */
    static getMessage(type) {
        let templateName;
        let subject;

        switch (type) {
            case c.EMAIL_TYPE_REGISTER:
                subject      = 'Спасибо за регистрацию!';
                templateName = 'thanks-for-sign-up.swig';
                break;
            case c.EMAIL_TYPE_EMAIL_CHANGE_REQUEST_FROM:
                subject      = 'Запрос на изменение E-mail адреса';
                templateName = 'change-email-request-from.swig';
                break;
            case c.EMAIL_TYPE_EMAIL_CHANGE_REQUEST_TO:
                subject      = 'Запрос на изменение E-mail адреса';
                templateName = 'change-email-request-to.swig';
                break;
            default:
                break;
        }

        if (templateName == null) {
            return null;
        }

        return {
            subject: subject,
            template: swig.compileFile(path.resolve(__dirname, '../views/email', templateName))
        };
    }
}

module.exports = Mailer;