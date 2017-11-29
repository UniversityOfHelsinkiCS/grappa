import test from 'ava';
const request = require('supertest');
const express = require('express');
const councilmeetings = require('../../src/routes/councilmeeting');
const config = require('../../knexfile');

const makeApp = () => {
    const app = express();
    app.use('/councilmeetings', councilmeetings)
    return app;
}

test.before(async t => {
    const knex = require('knex')(config['test']);
    await knex.migrate.rollback().then(() => {
        console.log("Rollback happened")
        return;
    }).catch(err => {
        console.log(err);
    })
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
    const res = await request(makeApp())
        .post('/councilmeetings')
        .send(councilmeetingWithoutId);
    t.is(res.status, 200);
    const body = res.body;
    const meeting = councilmeetingWithId
    t.is(JSON.stringify(body), JSON.stringify(meeting));
})

test('councilmeeting get all', async t => {
    t.plan(2);
    const app = makeApp();
    const res = await request(app)
        .get('/councilmeetings');
    t.is(res.status, 200);
    const body = res.body;
    const meetings = [ councilmeetingWithId ];
    t.is(JSON.stringify(body), JSON.stringify(meetings));    
})