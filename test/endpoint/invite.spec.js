import test from 'ava';

const request = require('supertest');
const express = require('express');
const invite = require('../../src/routes/invite');
const knex = require('../../src/db/connection');

const makeApp = (userId) => {
    const app = express();
    app.use('/invite', (req, res, next) => {
        req.session = {};
        req.session.user_id = userId;
        next();
    }, invite);
    return app;
};

async function createPerson(email) {
    const insert = await knex('person')
        .returning('personId')
        .insert({
            email,
            firstname: 'Olli O',
            lastname: 'Opiskelija'
        });

    return insert[0];
}

test.before(async t => {
    await knex.migrate.latest();
});

test('thesis is linked to author when invite is accepted', async t => {
    const email = 'test1@opiskelija.example.com';
    const personId = await createPerson(email);
    const agreementId = await knex('agreement').insert({}).returning('agreementId');
    const token = 'jk3h25jk45hjghj';
    await knex('emailInvite').insert({ email, token, agreement: agreementId[0], type: 'thesis_author' });

    const res = await request(makeApp(personId)).get(`/invite/thesis/${token}`);

    t.is(res.status, 200);

    const agreement = await knex('agreement').select().where('agreementId', agreementId[0]).first();
    t.is(agreement.authorId, personId);
});

test('invalid token is handled', async t => {
    const email = 'test1@opiskelija.example.com';
    const personId = await createPerson(email);
    const agreementId = await knex('agreement').insert({}).returning('agreementId');
    const token = 'kbhjbjj3bjb234';
    await knex('emailInvite').insert({ email, token, agreement: agreementId[0], type: 'thesis_author' });

    const res = await request(makeApp(personId)).get('/invite/thesis/FAKE_NEWS');

    t.is(res.status, 404);
});

test('token can be used only once', async t => {
    const email = 'test1@opiskelija.example.com';
    const personId = await createPerson(email);
    const agreementId = await knex('agreement').insert({}).returning('agreementId');
    const token = 'jkhiuhiad3';
    await knex('emailInvite').insert({ email, token, agreement: agreementId[0], type: 'thesis_author' });

    const res = await request(makeApp(personId)).get(`/invite/thesis/${token}`);
    t.is(res.status, 200);

    const res2 = await request(makeApp(personId)).get(`/invite/thesis/${token}`);
    t.is(res2.status, 404);
});
