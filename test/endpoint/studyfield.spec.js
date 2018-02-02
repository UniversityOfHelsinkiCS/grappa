import test from 'ava';
import { initDb } from '../utils';

process.env.DB_SCHEMA = 'studyfield_test';

const request = require('supertest');
const express = require('express');
const programmes = require('../../src/routes/programmes');
const mockStudyfields = require('../../src/mockdata/MockProgrammes');

const makeApp = (userId) => {
    const app = express();
    app.use('/programmes', (req, res, next) => {
        req.session = {};
        req.session.user_id = userId;
        next();
    }, programmes);
    return app;
};

test.before(async () => {
    await initDb();
});

test('programme get all', async (t) => {
    t.plan(2);
    const app = makeApp(1);
    const res = await request(app)
        .get('/programmes');

    t.is(res.status, 200);
    t.deepEqual(res.body, mockStudyfields);
});
