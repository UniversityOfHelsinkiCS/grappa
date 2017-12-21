import test from 'ava';
const request = require('supertest');
const express = require('express');
const attachment = require('../../src/routes/attachments');
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

test('attachment post & creates id', async t => {
    const res = await request(makeApp(1))
        .post('/attachments')
        .field('json', JSON.stringify({ agreementId: 1 }))
        .attach('attachment', './LICENSE')
    t.is(res.status, 200);
    const attachments = res.body;
    t.is(attachments.length, 1)
    const attachment = attachments[0]
    t.is(attachment.agreementId, 1)
    t.is(attachment.attachmentId, 1)
})
