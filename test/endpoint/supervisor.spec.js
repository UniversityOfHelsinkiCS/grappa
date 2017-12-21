import test from 'ava';
const request = require('supertest');
const express = require('express');
const supervisors = require('../../src/routes/supervisors');
const roleService = require('../../src/services/RoleService');
const knex = require('../../src/db/connection');

const makeApp = (userId) => {
    const app = express();
    app.use('/supervisors', (req, res, next) => {
        req.session = {};
        req.session.user_id = userId;
        next();
    }, supervisors)
    return app;
}

test.before(async t => {
    await knex.migrate.latest();
    await knex.seed.run();
})

const supervisorWithoutId = {
    firstname: "Testi",
    lastname: "Testinen",
    email: "",
    address: "",
    title: "",
    shibbolethId: "",
}

test('supervisor post & creates id', async t => {
    t.plan(2);
    const res = await request(makeApp())
        .post('/supervisors/')
        .send(supervisorWithoutId);
    t.is(res.status, 200);
    const supervisor = res.body;
    t.truthy(supervisor.personId);
})