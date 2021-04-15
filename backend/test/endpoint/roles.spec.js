import test from 'ava'

process.env.DB_SCHEMA = 'roles_test'

const { createPerson, initDb, makeTestApp } = require('../utils')
const request = require('supertest')
const rolesRoute = require('../../src/routes/roles')
const knex = require('../../src/db/connection').getKnex()

const makeApp = async id => makeTestApp('/roles', id, rolesRoute)

test.before(async () => {
    await initDb()
})

test('delete role', async (t) => {
    const { personId } = await createPerson()
    const idToDelete = await knex('personWithRole')
        .insert({
            programmeId: 1,
            personId,
            roleId: 1
        }).returning('personRoleId')

    const res = await request(await makeApp(personId))
        .del(`/roles/${idToDelete[0]}`)

    t.is(res.status, 200)

    const roles = await knex('personWithRole').select().where('personRoleId', idToDelete[0])
    t.is(roles.length, 0)
})

test('get available roles', async (t) => {
    const res = await request(await makeApp(1)).get('/roles/available')
    t.is(res.status, 200)
    t.is(res.body.length, 6)
})

test('save role test', async (t) => {
    const { personId } = await createPerson()
    const res = await request(await makeApp(1))
        .post('/roles')
        .send({ roleId: 2, personId, programmeId: 1 })

    t.is(res.status, 201)
})

test('save role test fail', async (t) => {
    const { personId } = await createPerson()
    const res = await request(await makeApp(1))
        .post('/roles')
        .send({ roleId: 1, personId, programmeId: 1 })

    const res2 = await request(await makeApp(personId))
        .post('/roles')
        .send({ roleId: 5, personId, programmeId: 1 })

    t.is(res.status, 500)
    t.is(res2.status, 403)
})
