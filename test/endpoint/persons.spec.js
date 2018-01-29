import test from 'ava';
import { deleteFromDb } from '../utils';

const request = require('supertest');
const express = require('express');
const persons = require('../../src/routes/persons');
const knex = require('../../src/db/connection');
const errorHandler = require('../../src/util/errorHandler');

const makeApp = (userId) => {
    const app = express();
    app.use('/persons', (req, res, next) => {
        req.session = {};
        req.session.user_id = userId;
        next();
    }, persons);

    app.use(errorHandler);
    return app;
}

test.before(async () => {
    await knex.migrate.latest();
    await deleteFromDb();
    await knex.seed.run();
})

/*
const personWithoutId = {
    shibbolethId: '123',
    email: 'testi@testaaja.com',
    firstname: 'Testi',
    lastname: 'Testaaja',
    isRetired: false,
    studentNumber: '0123456790',
    phone: '050 1234567'
}
*/

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

    const person = await knex('person').insert({ email: 'ei@ole.com' }).returning('personId');
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
