import test from 'ava';

const request = require('supertest');
const express = require('express');
const persons = require('../../src/routes/persons');
const knex = require('../../src/db/connection');

const makeApp = (userId) => {
    const app = express();
    app.use('/persons', (req, res, next) => {
        req.session = {};
        req.session.user_id = userId;
        next();
    }, persons)
    return app;
}

test.before(async (t) => {
    await knex.migrate.latest();
    await knex.seed.run();
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

test('person post & creates id', async (t) => {
    t.plan(3);
    const res = await request(makeApp(1))
        .post('/persons')
        .send(personWithoutId);
    t.is(res.status, 200);
    const person = res.body;
    t.truthy(person.personId > 0)
    delete person.personId;
    t.deepEqual(person, personWithoutId);
});

test('person get all for admin', async (t) => {
    t.plan(3);

    const allPersons = await knex('person').select();

    const res = await request(makeApp(1))
        .get('/persons');
    t.is(res.status, 200);
    const { persons, roles } = res.body;
    t.truthy(roles.length > 10);
    t.is(persons.length, allPersons.length);
});

test('person get all for student', async (t) => {
    t.plan(3);

    const person = await knex('person').insert({ email: 'ei@ole.com' }).returning('peronsonId');
    const personId = person[0];
    const res = await request(makeApp(personId)).get('/persons');

    t.is(res.status, 200);
    const { persons, roles } = res.body;

    t.truthy(roles.length > 10);
    t.is(persons.length, 5);
});

test('manager can get thesis authors', async (t) => {
    const res = await request(makeApp(2)).get('/persons');

    t.is(res.status, 200);
    t.is(res.body.persons.length, 6);
});
