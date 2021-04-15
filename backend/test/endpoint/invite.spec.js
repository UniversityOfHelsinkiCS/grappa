import test from 'ava'

process.env.DB_SCHEMA = 'invite_test'

const { createPerson, initDb, createToken } = require('../utils')
const request = require('supertest')
const express = require('express')
const invite = require('../../src/routes/invite')
const persons = require('../../src/routes/persons')
const knex = require('../../src/db/connection').getKnex()
const errorHandler = require('../../src/util/errorHandler')

const makeApp = (userId) => {
    const app = express()
    app.use('/invite', (req, res, next) => {
        req['x-access-token'] = createToken(userId)
        req.decodedToken = { userId }
        next()
    }, invite)
    app.use('/persons', (req, res, next) => {
        req['x-access-token'] = createToken(userId)
        req.decodedToken = { userId }
        next()
    }, persons)
    app.use(errorHandler)
    return app
}

test.before(async () => {
    await initDb()
})

test('thesis is linked to author when invite is accepted', async (t) => {
    const email = 'test19-invite@opiskelija.example.com'
    const { personId } = await createPerson(email)
    const agreementId = await knex('agreement').insert({}).returning('agreementId')
    const token = 'jk3h25jk45hjghj'
    await knex('emailInvite').insert({ email, token, agreement: agreementId[0], type: 'thesis_author' })

    const res = await request(makeApp(personId)).get(`/invite/thesis/${token}`)

    t.is(res.status, 200)

    const agreement = await knex('agreement').select().where('agreementId', agreementId[0]).first()
    t.is(agreement.authorId, personId)
})

test('thesis invite is accepted, secondary email is saved', async (t) => {
    const email = 'helsinki@example.com'
    const { personId } = await createPerson(email)
    const agreementId = await knex('agreement').insert({}).returning('agreementId')
    const token = 'asdfgh12987'
    await knex('emailInvite').insert({
        email: 'personal@example.com',
        token,
        agreement: agreementId[0],
        type: 'thesis_author'
    })

    await request(makeApp(personId)).get(`/invite/thesis/${token}`)

    const person = await knex('person').where('personId', personId).first()
    t.is(person.email, email)
    t.is(person.secondaryEmail, 'personal@example.com')
})

test('invalid token is handled', async (t) => {
    const email = 'test5-invite@opiskelija.example.com'
    const { personId } = await createPerson(email)
    const agreementId = await knex('agreement').insert({}).returning('agreementId')
    const token = 'kbhjbjj3bjb234'
    await knex('emailInvite').insert({ email, token, agreement: agreementId[0], type: 'thesis_author' })

    const res = await request(makeApp(personId)).get('/invite/thesis/FAKE_NEWS')

    t.is(res.status, 404)
})

test('token can be used only once', async (t) => {
    const email = 'test2-invite@opiskelija.example.com'
    const { personId } = await createPerson(email)
    const agreementId = await knex('agreement').insert({}).returning('agreementId')
    const token = 'jkhiuhiad3'
    await knex('emailInvite').insert({ email, token, agreement: agreementId[0], type: 'thesis_author' })

    const res = await request(makeApp(personId)).get(`/invite/thesis/${token}`)
    t.is(res.status, 200)

    const res2 = await request(makeApp(personId)).get(`/invite/thesis/${token}`)
    t.is(res2.status, 404)
})

test('role can be invited', async (t) => {
    const oldRows = await knex.select().from('personWithRole')
    const email = 'rooli@tarkastaja.example.com'
    const firstname = 'Kappa'
    const lastname = 'Kappa'
    const res = await request(makeApp(1))
        .post('/persons/invite')
        .send({ firstname, lastname, email, programmes: [1], role: 'grader' })

    t.is(res.status, 201)
    const rows = await knex.select().from('personWithRole')
    t.is(rows.length, oldRows.length + 1)
})

/*
test('role is linked to user when invite is accepted', async (t) => {
    const email = 'test1-invite@opiskelija.example.com'
    const { personId } = await createPerson(email)
    const token = 'fsdwe234gfd3'
    await knex('emailInvite').insert({ email, token, programme: 1, role: 1, type: 'role' })

    const res = await request(makeApp(personId)).get(`/invite/role/${token}`)

    t.is(res.status, 200)

    const personWithRole = await knex('personWithRole').select().where('personId', personId).first()
    t.is(personWithRole.roleId, 1)
})
*/
