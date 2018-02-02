import test from 'ava';
import { initDb } from '../utils';

process.env.DB_SCHEMA = 'programme_test';

const request = require('supertest');
const express = require('express');
const index = require('../../src/routes/index');
const errorHandler = require('../../src/util/errorHandler');

const makeApp = (userId) => {
    const app = express();
    app.use('/', (req, res, next) => {
        req.session = {};
        req.session.user_id = userId;
        next();
    }, index);

    app.use(errorHandler);
    return app;
};

test.before(async () => {
    initDb();
});

test('Initial test', async (t) => {
    t.plan(1);
    const app = makeApp();
    const res = await request(app)
        .get('/');
    t.is(res.status, 200);
});
