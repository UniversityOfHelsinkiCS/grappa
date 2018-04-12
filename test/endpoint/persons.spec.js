import test from 'ava'

process.env.DB_SCHEMA = 'persons_test'

const { initDb, makeTestApp } = require('../utils')
const request = require('supertest')
const persons = require('../../src/routes/persons')
const knex = require('../../src/db/connection').getKnex()

const makeApp = async (id) => {
    return makeTestApp('/persons', id, persons)
}

test.before(async () => {
    await initDb()
})

test.serial('person get all for admin', async (t) => {
    t.plan(3)

    const allPersons = await knex('person').select()

    const res = await request(await makeApp(1))
        .get('/persons')
    t.is(res.status, 200)
    const { persons, roles } = res.body
    t.truthy(roles.length > 10)
    t.is(persons.length, allPersons.length)
})

test.serial('person get all for student', async (t) => {
    t.plan(3)

    const person = await knex('person').insert({ email: 'ei@ole.com' }).returning('personId')
    const personId = person[0]
    const res = await request(await makeApp(personId)).get('/persons')

    t.is(res.status, 200)
    const { persons, roles } = res.body

    t.truthy(roles.length > 10)
    t.is(persons.length, 5)
})

test.serial('manager can get thesis authors', async (t) => {
    const res = await request(await makeApp(2)).get('/persons')

    t.is(res.status, 200)
    t.is(res.body.persons.length, 9)
})

test('email can be switched', async (t) => {
    const personIds = await knex('person')
        .insert({
            firstname: 'email',
            lastname: 'test',
            email: 'primary@example.com',
            secondaryEmail: 'other@example.com',
            shibbolethId: 'mailswitcherId'
        }).returning('personId')

    const res = await request(await makeApp(personIds[0])).put('/persons/email').send({ useSecondaryEmail: true })

    t.is(res.status, 200)

    const result1 = await knex('person')
        .select('useSecondaryEmail')
        .where('personId', personIds[0])
        .first()

    t.is(result1.useSecondaryEmail, true, 'Email not switched')

    await request(await makeApp(personIds[0])).put('/persons/email').send({ useSecondaryEmail: false })

    const result2 = await knex('person')
        .select('useSecondaryEmail')
        .where('personId', personIds[0])
        .first()

    t.is(result2.useSecondaryEmail, false, 'Email not switched back')
})

test('Can add an non-university person as a grader', async (t) => {
    const res = await request(await makeApp(1))
        .post('/persons/add_outsider')
        .send({ firstname: 'matti', lastname: 'puoskari', email: 'matti@puoskari.com', units: [1, 2] })
    t.truthy(res.body.person !== undefined)
    t.is(res.status, 201)
})

test('Cannot add outsider with wrong parameter names', async (t) => {
    const res = await request(await makeApp(1))
        .post('/persons/add_outsider')
        .send({ first: 'matti', last: 'puoskari', email: 'matti@puoskari.com', units: [1, 2] })
    t.truthy(res.body.person === undefined)
    t.is(res.status, 400)
})

test('Cannot add outsider without units', async (t) => {
    const res = await request(await makeApp(1))
        .post('/persons/add_outsider')
        .send({ firstname: 'matti', lastname: 'puoskari', email: 'matti@puoskari.com' })
    t.truthy(res.body.person === undefined)
    t.is(res.status, 400)
})

test('Cannot add outsider with missing person info', async (t) => {
    const res = await request(await makeApp(1))
        .post('/persons/add_outsider')
        .send({ firstname: 'matti', lastname: 'puoskari', units: [1, 2] })
    t.truthy(res.body.person === undefined)
    t.is(res.status, 400)
})
