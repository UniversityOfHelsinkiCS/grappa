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

test.before(async t => {
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

test('person post & creates id', async t => {    
    t.plan(3);
    const res = await request(makeApp(1))
        .post('/persons')
        .send(personWithoutId);
    t.is(res.status, 200);
    let person = res.body;
    t.truthy(person.personId > 0)
    delete person.personId;
    t.deepEqual(person, personWithoutId);
});

test('person get all for admin', async t => {    
    t.plan(3);
    const res = await request(makeApp(1))
        .get('/persons');
    t.is(res.status, 200);
    const persons = res.body.persons;
    const roles = res.body.roles;
    t.truthy(roles.length > 10);
    t.is(persons.length, 13);
});

test('person get all for student', async t => {
    t.plan(3);
    const res = await request(makeApp(7))
        .get('/persons');
    t.is(res.status, 200);
    const persons = res.body.persons;
    const roles = res.body.roles;
    t.truthy(roles.length > 10);
    t.is(persons.length, 4);
});