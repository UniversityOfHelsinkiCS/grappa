import test from 'ava';
const request = require('supertest');
const express = require('express');
const studyfields = require('../../src/routes/studyfields');
const config = require('../../src/db/knexfile');
const knex = require('../../src/db/connection');
const mockStudyfields = require('../../src/mockdata/MockStudyfields');

const makeApp = () => {
    const app = express();
    app.use('/studyfields', studyfields)
    return app;
}

test.before(async t => {
    //TODO: Fix this waiting.
    //Waiting for migrations to finish (in db/connection.js )
    const waitString = await new Promise(r => setTimeout(r, 500)).then(() => { return "Waited" });
    await knex('studyfield').del();
    await knex('studyfield').insert(mockStudyfields);
});

test('studyfield get all', async t => {
    t.plan(2);
    const app = makeApp();
    const res = await request(app)
        .get('/studyfields');
    t.is(res.status, 200);
    const body = res.body;
    t.is(JSON.stringify(body.length), JSON.stringify(mockStudyfields.length));
});