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
const should = require('should');

/**
 * HTML parser
 *
 * @type {*|exports|module.exports}
 */
const cheerio = require('cheerio');

const userModel  = require('../../../app/models/user');
const emailModel = require('../../../app/models/email');

const commonTests = require('../../common/_tests');

const USER_PHONE   = '3148383318';
const USER_EMAIL_1 = 'email-for-change@mail.com';
const USER_EMAIL_2 = 'email-to-change@mail.com';

const PASSWORD = 'passsw234';

let code1;
let code2;
let userId;

it('Sign out', commonTests.signOut);

it('Sign up', done => {
    commonTests.signUp({email: USER_EMAIL_1, phone: USER_PHONE, password: PASSWORD}, done);
});

it('Sign out', commonTests.signOut);

it('Sign In', done => {
    commonTests.signIn({email: USER_EMAIL_1, password: PASSWORD}, done);
});

it('Try get user change E-mail page', done => {
    request.get('/user/setting', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('li > a:contains(Изменение E-mail)').text().should.be.ok();
        $('label:contains(Текущий E-mail)').text().should.be.ok();
        $('label:contains(Новый E-mail)').text().should.be.ok();

        done();
    });
});

it('Initiate user E-mail update', done => {
    request.post('/user/setting/email', {
        currentEmail: USER_EMAIL_1,
        newEmail: USER_EMAIL_2
    }, function (err, res, body) {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        done();
    });
});

it('Try get user change E-mail page (check message)', done => {
    request.get('/user/setting', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('strong:contains(Мы отправили 2 сообщения по адресам)').text().should.be.ok();
        $('*:contains(' + USER_EMAIL_1 + ')').text().should.be.ok();
        $('*:contains(' + USER_EMAIL_2 + ')').text().should.be.ok();

        done();
    });
});

it('Check user object after E-mail change request', done => {
    userModel.model.findOne({email: USER_EMAIL_1}, (err, user) => {
        should.not.exists(err);

        code1 = user.emailChangeRequest.confirmationCode1;
        code2 = user.emailChangeRequest.confirmationCode2;

        code1.should.be.ok();
        code2.should.be.ok();

        user.emailChangeRequest.toEmail.should.be.equal(USER_EMAIL_2);
        user.emailChangeRequest.requestedAt.should.be.ok();

        userId = user.id;

        done();
    });
});

it('Check email was sent', done => {

    emailModel.model.find({
        subject: 'Запрос на изменение E-mail адреса',
        user: userId
    }).sort({toEmail: 1}).exec((err, emails) => {
        should.not.exists(err);

        emails.should.be.lengthOf(2);

        emails[0].subject.should.equal('Запрос на изменение E-mail адреса');
        emails[0].token.should.be.ok();
        emails[0].toEmail.should.equal(USER_EMAIL_1);

        let $ = cheerio.load(emails[0].html, {decodeEntities: false});

        $('h3').text().should.equal('Здравствуйте, Иван!');
        $('p.lead').text().should.containEql('Мы получили запрос на изменение E-mail адреса.');
        $('p.callout > a').attr('href').should.containEql('http://localhost:5000/change-email-verification/' + code1);

        emails[1].subject.should.equal('Запрос на изменение E-mail адреса');
        emails[1].token.should.be.ok();
        emails[1].toEmail.should.equal(USER_EMAIL_2);

        $ = cheerio.load(emails[1].html, {decodeEntities: false});

        $('h3').text().should.equal('Здравствуйте, Иван!');
        $('p.lead').text().should.containEql('Мы получили запрос на изменение E-mail адреса.');
        $('p.callout > a').attr('href').should.containEql('http://localhost:5000/change-email-verification/' + code2);

        done();
    });
});

it('Try confirm with wrong code', done => {
    request.get('/change-email-verification/wrongCodeHere', (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(500);
        
        $('*:contains(Ошибка на сервере)').text().should.be.ok();

        done();
    });
});

it('Confirm 1st E-mail', done => {
    request.get('/change-email-verification/' + code1, (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('*:contains(Один E-mail адрес успешно подтвержден, осталось подтвердить второй)').text().should.be.ok();

        done();
    });
});

it('Confirm 2st E-mail', done => {
    request.get('/change-email-verification/' + code2, (err, res, body, $) => {
        should.not.exists(err);
        res.statusCode.should.equal(200);

        $('*:contains(E-mail адрес был успешно изменен! Войдите, используя новый E-mail)').text().should.be.ok();

        done();
    });
});

it('Check user object after E-mail change request', done => {
    userModel.model.findOne({email: USER_EMAIL_2}, (err, user) => {
        should.not.exists(err);

        user.email.should.be.equal(USER_EMAIL_2);

        should.not.exists(user.emailChangeRequest.confirmationCode1);
        should.not.exists(user.emailChangeRequest.confirmationCode2);
        should.not.exists(user.emailChangeRequest.toEmail);
        should.not.exists(user.emailChangeRequest.requestedAt);

        done();
    });
});

it('Sign In', done => {
    commonTests.signIn({email: USER_EMAIL_2, password: PASSWORD}, done);
});

it('Sign out', commonTests.signOut);