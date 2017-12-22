import test from 'ava';
const request = require('supertest');
const express = require('express');
const attachment = require('../../src/routes/attachments');
const knex = require('../../src/db/connection');

const makeApp = (userId) => {
    const app = express();
    app.use('/attachments', (req, res, next) => {
        req.session = {};
        req.session.user_id = userId;
        next();
    }, attachment)
    return app;
}

test.before(async t => {
    await knex.migrate.latest();
    await knex.seed.run();
})

test('attachment post & creates id', async t => {
    const agreementId = 1;
    const res = await request(makeApp(1))
        .post('/attachments')
        .field('json', JSON.stringify({ agreementId }))
        .attach('attachment', './LICENSE')
    t.is(res.status, 200);
    const attachments = res.body;
    t.is(attachments.length, 1)
    t.is(attachments[0].agreementId, agreementId, 'Attachment linked to given agreementId')
})
