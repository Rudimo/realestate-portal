'use strict';

/**
 * Request helper
 * @type {Request|exports|module.exports}
 */
const request = require('../../common/_request');

/**
 * Should library
 *
 * @type {should|exports|module.exports}
 */
var should = require('should');

it('Signin', function (done) {
    request.post('/signin', {username: 'rudimo@yandex.ru', password: '112233'}, function (err, res, body, $) {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('li.active > a:contains(ОБЪЯВЛЕНИЯ)').text().should.be.ok();
        done();
    });
});

it('Try get user settings page', function (done) {
    request.get('/user/setting', function (err, res, body, $) {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('.nav a:contains(Контактная информация)').text().should.be.ok();

        done();
    });
});

it('Update user information', function (done) {
    request.post('/user/setting/profile', {
        firstName: 'Иван',
        lastName: 'Иванов',
        surName: 'Иванович',
        phone: '9880000000',
        //isAgent: false TODO: Test me
    }, function (err, res, body) {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        // These checks will be failed after security improvement
        JSON.parse(body).loggedUser.firstName.should.be.equal('Иван');
        JSON.parse(body).loggedUser.lastName.should.be.equal('Иванов');
        JSON.parse(body).loggedUser.surName.should.be.equal('Иванович');
        JSON.parse(body).loggedUser.phone.should.be.equal('9880000000');

        done();
    });
});

it('Update user information back', function (done) {
    request.post('/user/setting/profile', {
        firstName: 'ИванЧай',
        lastName: 'Васильев',
        surName: 'Отчество пользователя',
        phone: '9200240144'
        //isAgent: false TODO: Test me
    }, function (err, res, body) {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        // These checks will be failed after security improvement
        JSON.parse(body).loggedUser.firstName.should.be.equal('ИванЧай');
        JSON.parse(body).loggedUser.lastName.should.be.equal('Васильев');
        JSON.parse(body).loggedUser.surName.should.be.equal('Отчество пользователя');
        JSON.parse(body).loggedUser.phone.should.be.equal('9200240144');

        done();
    });
});

/*it('Update user information (wrong firstName)', function (done) {
    request.post('/user/setting/profile', {
        firstName: '',
        lastName: 'Фамилия пользователя',
        surName: 'Отчество пользователя',
        phone: '9182222222'
    }, function (err, res, body) {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        JSON.parse(body).result.should.be.equal('ERR');

        done();
    });
});*/

it('Update user information (wrong phone)', function (done) {
    request.post('/user/setting/profile', {
        firstName: 'Имя пользователя',
        lastName: 'Фамилия пользователя',
        surName: 'Отчество пользователя',
        phone: '92001287211' // <-- Phone is too long
    }, function (err, res, body) {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        JSON.parse(body).result.should.be.equal('ERR');

        done();
    });
});

/*it('Update user notifications settings', function (done) {
    request.post('/user/settings/notifications', {
        emailNotifications: {
            callbackRequest: true,
            newMessage: false,
            objectModerationPassed: true,
            objectModerationRejected: false,
            objectReported: true,

            newsletter: false,
            wizard: true
        },
        smsNotifications: {
            callbackRequest: true
        }
    }, function (err, res, body) {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        // These checks will be failed after security improvement
        JSON.parse(body).loggedUser.emailNotifications.should.be.deepEqual({
            callbackRequest: true,
            newMessage: false,
            objectModerationPassed: true,
            objectModerationRejected: false,
            objectReported: true,
            newsletter: false,
            wizard: true
        });

        JSON.parse(body).loggedUser.smsNotifications.should.be.deepEqual({
            callbackRequest: true
        });

        done();
    });
});*/

it('Update user password', function (done) {
    request.post('/user/setting/password', {
        currentPassword: '112233',
        newPassword: '112233',
        newPasswordConfirmation: '112233'
    }, function (err, res, body) {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        JSON.parse(body).should.be.deepEqual({
            result: 'OK'
        });

        done();
    });
});

it('Update user email', function (done) {
    request.post('/user/setting/email', {
        currentEmail: 'rudimo@yandex.ru',
        newEmail: 'rudimo92@gmail.com'
    }, function (err, res, body) {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        // These checks will be failed after security improvement
        JSON.parse(body).should.be.deepEqual({
            result: 'OK'
        });

        done();
    });
});

/*it('Cancel E-mail change', function (done) {
    request.get('/user/settings/email-change-cancel', function (err, res, body, $) {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('form > fieldset > legend:contains(Изменение E-mail адреса аккаунта)').text().should.be.ok();
        $('label:contains(Текущий E-mail)').text().should.be.ok();

        done();
    });
});*/
