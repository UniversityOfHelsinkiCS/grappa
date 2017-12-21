import test from 'ava';
const request = require('supertest');
const express = require('express');
const councilmeetings = require('../../src/routes/councilmeeting');
const knex = require('../../src/db/connection');

const makeApp = (userId) => {
    const app = express();
    app.use('/councilmeetings', (req, res, next) => {
        req.session = {};
        req.session.user_id = userId;
        next();
    }, councilmeetings)
    return app;
}

test.before(async t => {
    await knex.migrate.latest();
    await knex.seed.run();
})

const councilmeetingWithoutId = {
    date: '2017-11-29T22:00:00.000Z',
    instructorDeadline: '2017-11-20T22:00:00.000Z',
    studentDeadline: '2017-11-10T22:00:00.000Z',
}

const councilmeetingWithId = {
    councilmeetingId: 1,
    date: '2017-11-29T22:00:00.000Z',
    instructorDeadline: '2017-11-20T22:00:00.000Z',
    studentDeadline: '2017-11-10T22:00:00.000Z',
}

test('councilmeeting post & creates id', async t => {
    t.plan(2);
    const res = await request(makeApp(1))
        .post('/councilmeetings')
        .send(councilmeetingWithoutId);
    t.is(res.status, 200);
    const body = res.body;
    const meeting = councilmeetingWithId
    t.is(JSON.stringify(body), JSON.stringify(meeting));
})

test('councilmeeting get all', async t => {
    t.plan(2);
    const app = makeApp(1);
    const res = await request(app)
        .get('/councilmeetings');
    t.is(res.status, 200);
    const body = res.body;
    const meetings = [councilmeetingWithId];
    t.is(JSON.stringify(body), JSON.stringify(meetings));
})