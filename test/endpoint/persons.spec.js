import test from 'ava';
const request = require('supertest');
const express = require('express');
const persons = require('../../src/routes/persons');
const config = require('../../src/db/knexfile');

const makeApp = () => {
    const app = express();
    app.use('/persons', persons)
    return app;
}

test.before(async t => {
    //TODO: Fix this waiting.
    //Waiting for migrations to finish (in db/connection.js )
    const waitString = await new Promise(r => setTimeout(r, 500)).then(() => { return "Waited" })
    // console.log(waitString);
})


const personWithoutId = {
    shibbolethId: '123',
    email: 'amanda@admin.com',
    firstname: 'Amanda',
    lastname: 'Admin',
    title: 'Dr.',
    isRetired: 0,
    studentNumber: ('0123456790'),
    address: ('Leppäsuonkatu'),
    phone: '050 1234567',
    major: 'Käpistely'
}

const personWithId = {
    personId: 1,
    shibbolethId: '123',
    email: 'amanda@admin.com',
    firstname: 'Amanda',
    lastname: 'Admin',
    title: 'Dr.',
    isRetired: 0,
    studentNumber: ('0123456790'),
    address: ('Leppäsuonkatu'),
    phone: '050 1234567',
    major: 'Käpistely'
}

test('person post & creates id', async t => {
    t.plan(1);
    const res = await request(makeApp())
        .post('/persons')
        .send(personWithoutId);
    t.is(res.status, 200);
});

test('person get all', async t => {
    t.plan(2);
    const app = makeApp();
    const res = await request(app)
        .get('/persons');
    t.is(res.status, 200);
    const body = res.body;
    const persons = [personWithId];
    t.is(JSON.stringify(body), JSON.stringify(persons));
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
    t.is(JSON.stringify(body), JSON.stringify([ personWithId ]))
});