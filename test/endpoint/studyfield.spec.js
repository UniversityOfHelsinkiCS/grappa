import test from 'ava';
const request = require('supertest');
const express = require('express');
const studyfields = require('../../src/routes/studyfields');
const mockStudyfields = require('../../src/mockdata/MockStudyfields');
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

test('studyfield get all', async t => {
    t.plan(2);
    const app = makeApp(1);
    const res = await request(app)
        .get('/studyfields');
    t.is(res.status, 200);
    const body = res.body;
    t.is(JSON.stringify(body.length), JSON.stringify(mockStudyfields.length));
});