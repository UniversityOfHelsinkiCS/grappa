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
    }, councilmeetings);
    return app;
};

test.before(async () => {
    await knex.migrate.latest();
    await knex.seed.run();
});

const councilmeetingWithoutId = {
    date: '2017-11-29T22:00:00.000Z',
    instructorDeadline: '2017-11-20T22:00:00.000Z',
    studentDeadline: '2017-11-10T22:00:00.000Z',
    programmeId: 1
};

test('councilmeeting post & creates id', async (t) => {
    t.plan(3);
    const res = await request(makeApp(1))
        .post('/councilmeetings')
        .send(councilmeetingWithoutId);
    t.is(res.status, 200);
    const councilmeeting = res.body;
    t.truthy(councilmeeting.councilmeetingId);
    delete councilmeeting.councilmeetingId;
    t.deepEqual(councilmeeting, councilmeetingWithoutId);
});

test('councilmeeting get all', async (t) => {
    t.plan(2);

    const res = await request(makeApp(1)).get('/councilmeetings');

    t.is(res.status, 200);
    t.truthy(res.body.length > 0);
});

test('councilmeeting delete', async (t) => {
    const meeting = await knex('councilmeeting').insert(councilmeetingWithoutId).returning('councilmeetingId');
    const res = await request(makeApp(1)).del(`/councilmeetings/${meeting[0]}`);

    t.is(res.status, 200);

    const meetingsAfter = await knex('councilmeeting').select().where('councilmeetingId', meeting[0]);

    t.is(meetingsAfter.length, 0);
});

test('councilmeeting update', async (t) => {
    const updatedData = {
        date: '2019-11-29T22:00:00.000Z',
        instructorDeadline: '2019-11-20T22:00:00.000Z',
        studentDeadline: '2019-11-10T22:00:00.000Z',
        programmeId: 1
    };
    const meeting = await knex('councilmeeting').insert(councilmeetingWithoutId).returning('councilmeetingId');
    const res = await request(makeApp(1))
        .put(`/councilmeetings/${meeting[0]}`)
        .send(updatedData);

    t.is(res.status, 200);

    const meetingsAfter = await knex('councilmeeting').select().where('councilmeetingId', meeting[0]);

    updatedData.councilmeetingId = meeting[0];
    t.deepEqual(meetingsAfter[0], updatedData);
});
