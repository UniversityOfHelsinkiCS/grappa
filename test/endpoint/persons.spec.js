import test from 'ava'

process.env.DB_SCHEMA = 'persons_test'

const { initDb, makeTestApp } = require('../utils')
const request = require('supertest')
const persons = require('../../src/routes/persons')
const knex = require('../../src/db/connection').getKnex()

const makeApp = async (id) => {
    const userId = (await knex.select().from('person').where('personId', id)
        .first()).shibbolethId
    return makeTestApp('/persons', userId, persons)
}

test.before(async () => {
    await initDb()
})

test('person get all for admin', async (t) => {
    t.plan(3)

    const allPersons = await knex('person').select()

    const res = await request(await makeApp(1))
        .get('/persons')
    t.is(res.status, 200)
    const { persons, roles } = res.body
    t.truthy(roles.length > 10)
    t.is(persons.length, allPersons.length + 2) // Tests below creates new persons
})

test('person get all for student', async (t) => {
    t.plan(3)

    const person = await knex('person').insert({ email: 'ei@ole.com' }).returning('personId')
    const personId = person[0]
    const res = await request(await makeApp(personId)).get('/persons')

    t.is(res.status, 200)
    const { persons, roles } = res.body

    t.truthy(roles.length > 10)
    t.is(persons.length, 5)
})

test('manager can get thesis authors', async (t) => {
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
