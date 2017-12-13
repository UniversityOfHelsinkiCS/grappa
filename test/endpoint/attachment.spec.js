import test from 'ava';
const request = require('supertest');
const express = require('express');
const attachment = require('../../src/routes/attachments');

const makeApp = () => {
    const app = express();
    app.use('/attachments', (req, res, next) => {
        req.session = {};
        req.session.user_id = 1;
        next();
    }, attachment)
    return app;
}

test.before(async t => {
    //TODO: Fix this waiting.
    //Waiting for migrations to finish (in db/connection.js )
    const waitString = await new Promise(r => setTimeout(r, 500)).then(() => { return "Waited" })
})

test('attachment post & creates id', async t => {
    const res = await request(makeApp())
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
