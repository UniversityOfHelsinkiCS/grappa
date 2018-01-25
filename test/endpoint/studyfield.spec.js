import test from 'ava';
import { deleteFromDb } from '../utils';

const request = require('supertest');
const express = require('express');
const programmes = require('../../src/routes/programmes');
const mockStudyfields = require('../../src/mockdata/MockProgrammes');
const knex = require('../../src/db/connection');

const makeApp = (userId) => {
    const app = express();
    app.use('/programmes', (req, res, next) => {
        req.session = {};
        req.session.user_id = userId;
        next();
    }, programmes)
    return app;
}

test.before(async (t) => {
    await knex.migrate.latest();
    await deleteFromDb();
    await knex.seed.run();
})

test('programme get all', async (t) => {
    t.plan(2);
    const app = makeApp(1);
    const res = await request(app)
        .get('/programmes');
    t.is(res.status, 200);
    const body = res.body;

    t.deepEqual(body, mockStudyfields);
});
