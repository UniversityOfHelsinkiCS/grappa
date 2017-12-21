import test from 'ava';
const request = require('supertest');
const express = require('express');
const persons = require('../../src/routes/persons');
const config = require('../../src/db/knexfile');

const makeApp = () => {
    const app = express();
    app.use('/persons', (req, res, next) => {
        req.session = {};
        req.session.user_id = 1;
        next();
    }, persons)
    return app;
}

test.before(async t => {
    //TODO: Fix this waiting.
    //Waiting for migrations to finish (in db/connection.js )
    const waitString = await new Promise(r => setTimeout(r, 1000)).then(() => { return "Waited" })
    // console.log(waitString);
})


const personWithoutId = {
    shibbolethId: '123',
    email: 'testi@testaaja.com',
    firstname: 'Testi',
    lastname: 'Testaaja',
    title: 'Dr.',
    isRetired: 0,
    studentNumber: '0123456790',
    address: 'Leppäsuonkatu',
    phone: '050 1234567',
    major: 'Käpistely'
}

test('person post & creates id', async t => {
    t.plan(3);
    const res = await request(makeApp())
        .post('/persons')
        .send(personWithoutId);
    t.is(res.status, 200);
    let person = res.body;
    t.truthy(person.personId > 0)
    delete person.personId;
    t.deepEqual(person, personWithoutId);
});

test('person get all', async t => {
    t.plan(2);
    const app = makeApp();
    const res = await request(app)
        .get('/persons');
    t.is(res.status, 200);
    const persons = res.body.persons;
    const roles = res.body.roles;
    t.truthy(roles.length > 10);
    t.truthy(persons.length > 10);
});

test('person get by ID', async t => {
    t.plan(2);
    const app = makeApp();
    const id = 1;
    const res = await request(app)
        .get('/persons/' + id);
    t.is(res.status, 200);
    const body = res.body;
    // console.log('body');
    // console.log(body);
    t.is(JSON.stringify(body), JSON.stringify([personWithId]))
});