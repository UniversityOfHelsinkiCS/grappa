import test from 'ava';
const request = require('supertest');
const express = require('express');
const roles = require('../../src/routes/roles');
const knex = require('../../src/db/connection');

const makeApp = (userId) => {
    const app = express();
    app.use('/roles', (req, res, next) => {
        req.session = {};
        req.session.user_id = userId;
        next();
    }, roles);

    return app;
};

test.before(async t => {
    await knex.migrate.latest();
    await knex.seed.run();
});

test('study field can be set to visitor role', async t => {
    t.plan(2);

    const visitorRoleForm = {
        studyfieldId: 1,
        personId: 1,
        name: 'visitor'
    };

    const res = await request(makeApp(1))
        .post('/roles')
        .send(visitorRoleForm);

    t.is(res.status, 200);

    const roles = await knex.select()
        .from('personWithRole')
        .where('personId', 1)
        .where('roleId', 7)
        .first();

    console.log(roles);
    t.truthy(roles);
});
