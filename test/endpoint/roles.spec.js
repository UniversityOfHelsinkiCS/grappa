import test from 'ava';
import { createPerson } from '../utils';

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

    const personId = await createPerson();
    const visitorRoleForm = { studyfieldIds: [1] };

    const res = await request(makeApp(personId))
        .put('/roles/visitor')
        .send(visitorRoleForm);

    t.is(res.status, 200);

    const roles = await knex.select()
        .from('personWithRole')
        .where('personId', personId)
        .where('roleId', 7)
        .first();

    t.truthy(roles);
});

test('visitor role studyfield can be updated', async t => {
    t.plan(2);

    const personId = await createPerson();

    await knex('personWithRole')
        .insert({
            studyfieldId: 1,
            personId: personId,
            roleId: 7
        });

    const visitorRoleForm = { studyfieldIds: [2] };
    const res = await request(makeApp(personId))
        .put('/roles/visitor')
        .send(visitorRoleForm);

    t.is(res.status, 200);

    const role = await knex.select()
        .from('personWithRole')
        .where('personId', personId)
        .where('roleId', 7)
        .first();

    t.is(role.studyfieldId, 2);
});

test('delete role', async t => {
    const personId = await createPerson();
    const idToDelete = await knex('personWithRole')
        .insert({
            studyfieldId: 1,
            personId: personId,
            roleId: 1
        }).returning('personRoleId');

    const res = await request(makeApp(personId))
        .del(`/roles/${idToDelete[0]}`);

    t.is(res.status, 200);

    const roles = await knex('personWithRole').select().where('personRoleId', idToDelete[0]);
    t.is(roles.length, 0);
});

test('get available roles', async t => {
    const res = await request(makeApp()).get('/roles/available');
    t.is(res.status, 200);
    t.is(res.body.length, 7);
});

test('save role test', async t => {
    const personId = await createPerson();
    const res = await request(makeApp(personId))
        .post('/roles')
        .send({ roleId: 1, personId, studyfieldId: 1 });

    t.is(res.status, 200);
});
