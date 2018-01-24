import test from 'ava';
import { deleteFromDb } from '../utils';

const request = require('supertest');
const express = require('express');
const supervisors = require('../../src/routes/supervisors');
const knex = require('../../src/db/connection');
const errorHandler = require('../../src/util/errorHandler');

const makeApp = (userId) => {
    const app = express();
    app.use('/supervisors', (req, res, next) => {
        req.session = {};
        req.session.user_id = userId;
        next();
    }, supervisors);

    app.use(errorHandler);

    return app;
}

test.before(async (t) => {
    await knex.migrate.latest();
    await deleteFromDb();
    await knex.seed.run();
})

const supervisorWithoutId = {
    firstname: 'Testi',
    lastname: 'Testinen',
    email: '',
    shibbolethId: ''
}

test('supervisor post & creates id', async (t) => {
    t.plan(2);
    const res = await request(makeApp())
        .post('/supervisors/')
        .send(supervisorWithoutId);
    t.is(res.status, 200);
    const supervisor = res.body;
    t.truthy(supervisor.personId);
})
