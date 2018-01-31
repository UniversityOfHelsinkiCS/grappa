import test from 'ava';
import sinon from 'sinon';
import { deleteFromDb } from '../utils';

const request = require('supertest');
const express = require('express');
const index = require('../../src/routes/index');
const shibboleth = require('../../src/routes/auth');
const knex = require('../../src/db/connection');
const auth = require('../../src/middleware/auth');

let i = 0;

const makeApp = (email, id, sn, fn) => {
    const app = express();
    app.use((req, res, next) => {
        i += 1;
        req.session = { destroy: sinon.spy() };
        req.headers['shib-session-id'] = 'test1234';
        req.headers['unique-code'] = `urn:schac:personalUniqueCode:int:studentID:helsinki.fi:123456789${i}`;
        req.headers.sn = sn || 'Opiskelija';
        req.headers.givenname = fn || 'Olli O';
        req.headers.displayname = 'Olli';
        req.headers.uid = id || 'oopiskelija';
        req.headers.mail = email || 'opiskelija@example.com';
        req.headers.edupersonaffiliation = 'student;member';
        req.headers.shib_logout_url = 'https://example.com/logout/';
        next();
    });
    app.use(auth.shibRegister);
    app.use('/', index);
    app.use(auth.checkAuth);
    app.use('/user', shibboleth);
    return app;
};

test.before(async () => {
    await knex.migrate.latest();
    await deleteFromDb();
    await knex.seed.run();
});

test('new shibboleth login passes register', async (t) => {
    t.plan(1);
    const app = makeApp();
    const res = await request(app)
        .get('/');
    t.is(res.status, 200);
});

// TODO: figure out why this test hangs if previous one is not there
test.skip('new shibboleth login creates user', async (t) => {
    t.plan(3);
    const app = makeApp();
    const res = await request(app)
        .get('/user/login');
    t.is(res.status, 200);
    // t.true(res.body.personId !== undefined);
    // or at the moment:
    t.is(res.body.personId, 13);
    t.is(res.body.shibbolethId, 'oopiskelija');
});

// Currently not supported
test.skip('exsisting user is updated if login with new sibboleth id', async (t) => {
    t.plan(2);
    const email = 'exsisting@example.com';
    const shibbolethId = 'existing123';
    const personId = await knex('person')
        .returning('personId')
        .insert({
            email,
            firstname: 'Olli O',
            lastname: 'Opiskelija',
            isRetired: false
        });

    const app = makeApp(email, shibbolethId);
    const res = await request(app)
        .get('/user/login');
    t.is(res.status, 200);

    const person = await knex.select().from('person').where('personId', personId[0]).first();

    t.is(person.shibbolethId, shibbolethId);
});

test('logout gives redirect', async (t) => {
    t.plan(2);
    const app = makeApp();
    const res = await request(app)
        .get('/user/logout');

    t.is(res.status, 200);
    t.is(res.body.logoutUrl, 'https://example.com/logout/');
});

test('names are saved in correct encoding', async (t) => {
    const app = makeApp('encoding@example.com', 'encodingTest', 'LemstrÃ¶m', 'Ã¶');
    const res = await request(app).get('/');

    t.is(res.status, 200);

    const person = await knex('person')
        .select()
        .where('email', 'encoding@example.com')
        .where('lastname', 'Lemström')
        .where('firstname', 'ö')
        .first();

    t.truthy(person);
});
