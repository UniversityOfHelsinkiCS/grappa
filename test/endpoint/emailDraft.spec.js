import test from 'ava';
const request = require('supertest');
const express = require('express');
const emailDrafts = require('../../src/routes/emailDrafts');
const knex = require('../../src/db/connection');

const makeApp = (userId) => {
    const app = express();
    app.use('/emailDrafts', (req, res, next) => {
        req.session = {};
        req.session.user_id = userId;
        next();
    }, emailDrafts);
    return app;
};

test.before(async t => {
    await knex.migrate.latest();
    await knex.seed.run();
});

test('emailDrafts get all', async t => {
    t.plan(2);
    const res = await request(makeApp(1)).get('/emailDrafts');
    t.is(res.status, 200);
    const emailDrafts = res.body;
    t.truthy(emailDrafts.length > 0);
});

test('emailDraft update', async t => {
    const emailDraft = await knex.insert({ title: 'foo', body: 'bar' })
        .into('emailDraft')
        .returning('emailDraftId');
    const draftId = emailDraft[0];

    const res = await request(makeApp(1))
        .post(`/emailDrafts/${draftId}`)
        .send({ title: 'test title', body: 'test body' });

    t.is(res.status, 200);
});
