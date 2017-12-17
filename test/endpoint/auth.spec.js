import test from 'ava';
const request = require('supertest');
const express = require('express');
const index = require('../../src/routes/index');
const shibboleth = require('../../src/routes/shibboleth');
const config = require('../../src/db/knexfile');
const auth = require('../../src/middleware/auth');

const makeApp = () => {
    const app = express();
    app.use((req, res, next) => {
        req.session = {};
        req.headers['shib-session-id'] = 'test1234';
        req.headers['unique-code'] = 'urn:schac:personalUniqueCode:int:studentID:helsinki.fi:123456789';
        req.headers['sn'] = 'Opiskelija';
        req.headers['givenname'] = 'Olli O';
        req.headers['displayname'] = 'Olli';
        req.headers['uid'] = 'oopiskelija';
        req.headers['mail'] = 'opiskelija@example.com';
        req.headers['edupersonaffiliation'] = 'student;member';
        req.headers['shib_logout_url'] = 'https://example.com/logout/';
        next();
    });
    app.use(auth.shibRegister);
    app.use('/', index)
    app.use(auth.checkAuth);
    app.use('/login', shibboleth)
    app.use('/logout', shibboleth)
    return app;
}

test.before(async t => {
    //TODO: Fix this waiting.
    //Waiting for migrations to finish (in db/connection.js )
    const waitString = await new Promise(r => setTimeout(r, 500)).then(() => { return "Waited" })
    // console.log(waitString);
})

test('new shibboleth login passes register', async t => {
    t.plan(1);
    const app = makeApp();
    const res = await request(app)
        .get('/');
    t.is(res.status, 200);
});

// TODO: figure out why this test hangs if previous one is not there
test('new shibboleth login creates user', async t => {
    t.plan(3);
    const app = makeApp();
    const res = await request(app)
        .get('/login');
    t.is(res.status, 200);
    // t.true(res.body.personId !== undefined);
    // or at the moment:
    t.is(res.body.personId, 1);
    t.is(res.body.shibbolethId, 'oopiskelija');
});

test('logout gives redirect', async t => {
    t.plan(1);
    const app = makeApp();
    const res = await request(app)
        .get('/logout/logout');
    t.is(res.status, 302);
});
