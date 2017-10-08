'use strict';

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
const request = require('../../common/_request');

/**
 * HTML parser
 *
 * @type {*|exports|module.exports}
 */
const cheerio = require('cheerio');

let emailModel = require('../../../app/models/email').model;
let userModel  = require('../../../app/models/user').model;

let userId = null;

const EMAIL = 'rudimo@yandex.ru';
const PHONE = '9186683843';

it('Load signup form', done => {
    request.get('/signup', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('label:contains(Я согласен)').text().should.be.ok();

        done();
    });
});

it('Try register (password doesn\'t match)', done => {
    request.post('/signup', {
        email: EMAIL,
        firstName: 'Иван',
        phone: PHONE,
        password: '12345',
        password2: '54321',
        terms: 'on'
    }, (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('div.alert-danger:contains(Введенные пароли не совпадают)').text().should.be.ok();
        done();
    });
});

it('Try register (wrong E-mail address)', done => {
    request.post('/signup', {
        email: 'wrong-email.ru',
        firstName: 'Иван',
        phone: PHONE,
        password: '12345',
        password2: '12345',
        terms: 'on'
    }, (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('div.alert-danger:contains(Пожалуйста, проверьте введенный E-mail адрес)').text().should.be.ok();
        done();
    });
});

it('Try register (wrong phone)', done => {
    request.post('/signup', {
        email: EMAIL,
        firstName: 'Иван',
        phone: '123',
        password: '12345',
        password2: '12345',
        terms: 'on'
    }, (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('div.alert-danger:contains(Пожалуйста, проверьте введенный номер телефона)').text().should.be.ok();
        done();
    });
});

it('Try register (wrong terms)', done => {
    request.post('/signup', {
        email: EMAIL,
        firstName: 'Иван',
        phone: PHONE,
        password: '12345',
        password2: '12345'
    }, (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('div.alert-danger:contains(Вы должны согласиться с правилами сервиса)').text().should.be.ok();
        done();
    });
});

it('Success register', done => {
    request.post('/signup', {
        email: EMAIL,
        firstName: 'Иван',
        phone: PHONE,
        password: '112233',
        password2: '112233',
        isAgent: 'on',
        terms: 'on'
    }, (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('*:contains(Аккаунт был успешно создан)').text().should.be.ok();
        //$('*:contains(На данный момент у Вас нет ни одного объявления)').text().should.be.ok();
        done();
    });
});

it('Check user model after sign up', done => {
    userModel.findOne({email: EMAIL}, (err, user) => {
        should.not.exists(err);

        user.should.be.ok();
        user.email.should.equal(EMAIL);
        user.firstName.should.equal('Иван');
        should.not.exists(user.lastName);
        user.phone.should.equal(PHONE);
        user.isAgent.should.equal(true);
        user.newsLetter.should.equal(true);
        user.isAdmin.should.equal(false);
        user.emailVerificationCode.should.be.ok();

        userId = user.id;

        // Make Admin
        user.isAdmin = true;
        user.save(err => {
            should.not.exists(err);

            done();
        });
    });
});

it('Check email was sent', done => {
    emailModel.findOne({user: userId}, (err, email) => {
        should.not.exists(err);

        email.should.be.ok();
        email.subject.should.equal('Спасибо за регистрацию!');
        email.token.should.be.ok();

        let $ = cheerio.load(email.html, {decodeEntities: false});

        $('h3').text().should.equal('Здравствуйте, Иван!');
        $('p.lead').text().should.containEql('Мы благодарим Вас за регистрацию на Realza.ru!');
        $('p > strong').text().should.containEql('9186683843');

        $('p.callout > a').attr('href').should.containEql('http://localhost:5000/confirm-email/');

        done();
    });
});

it('Logout', done => {
    request.get('/logout', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);
        done();
    });
});

it('Wrong login', done => {
    request.post('/signin', {username: '123', password: '123'}, (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('div.alert-danger:contains(не зарегистрирован)').text().should.be.ok();
        done();
    });
});

it('Wrong password', done => {
    request.post('/signin', {username: 'rudimo@yandex.ru', password: '11111111'}, (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('div.alert-danger:contains(Неверный пароль)').text().should.be.ok();
        done();
    });
});

it('Success signin', done => {
    request.post('/signin', {username: EMAIL, password: '112233'}, (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('li.active > a:contains(ОБЪЯВЛЕНИЯ)').text().should.be.ok();
        done();
    });
});

it('Logout', done => {
    request.get('/logout', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);
        done();
    });
});