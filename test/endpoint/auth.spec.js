import test from 'ava'
import sinon from 'sinon'
import { initDb } from '../utils'

process.env.DB_SCHEMA = 'auth_test'

const request = require('supertest')
const express = require('express')
const index = require('../../src/routes/index')
const shibboleth = require('../../src/routes/auth')
const knex = require('../../src/db/connection').getKnex()
const auth = require('../../src/middleware/auth')

const makeApp = (user, logout) => {
    const app = express()

    const { email, id, surname, firstname } = user

    app.use((req, res, next) => {
        req.session = { destroy: logout }
        req.headers['shib-session-id'] = 'test1234'
        req.headers['unique-code'] = `urn:schac:personalUniqueCode:int:studentID:helsinki.fi:0${numberFromTo(10000000, 19999999)}`
        req.headers.sn = surname
        req.headers.givenname = firstname
        req.headers.uid = id
        req.headers.mail = email
        req.headers.shib_logout_url = 'https://example.com/logout'
        next()
    })
    app.use(auth.shibRegister)
    app.use('/', index)
    app.use(auth.checkAuth)
    app.use('/user', shibboleth)
    return app
}

test.before(async () => {
    await initDb()
})

const numberFromTo = (from, to) => Math.round(Math.random() * (to - from)) + from

const generateUser = () => ({
    email: `sahko${numberFromTo(0, 10000)}@posti.fi`,
    id: `id${numberFromTo(0, 10000)}`,
    surname: `Sukunimi${numberFromTo(0, 10000)}`,
    firstname: `Etunimi${numberFromTo(0, 10000)}`
})

test('new shibboleth login creates a new user', async (t) => {
    t.plan(2)
    const user = generateUser()
    const app = makeApp(user)
    const res = await request(app)
        .get('/')
    t.is(res.status, 200)
    const persons = await knex('person').select()
    const foundPerson = persons.find(person =>
        person.shibbolethId === user.id &&
        person.email === user.email &&
        person.firstname === user.firstname &&
        person.lastname === user.surname
    )
    t.truthy(foundPerson,
        `person ${JSON.stringify(user)} was not found in persons`)
})

test('logout gives redirect address', async (t) => {
    t.plan(3)
    const user = generateUser()
    const sessionDestroyStub = sinon.stub()
    const app = makeApp(user, sessionDestroyStub)
    const res = await request(app)
        .get('/user/logout')

    t.is(res.status, 200)
    t.is(res.body.logoutUrl, 'https://example.com/logout?return=https://grappa.cs.helsinki.fi/v2/')
    t.truthy(sessionDestroyStub.calledOnce)
})

test('names are saved in correct encoding', async (t) => {
    t.plan(2)
    const user = {
        email: 'encoding@example.com',
        id: 'encodingTest',
        surname: 'LemstrÃ¶m',
        firstname: 'Ã¶'
    }
    const app = makeApp(user)
    const res = await request(app)
        .get('/')

    t.is(res.status, 200)

    const person = await knex('person')
        .select()
        .where('email', 'encoding@example.com')
        .where('lastname', 'Lemström')
        .where('firstname', 'ö')
        .first()
    t.truthy(person)
})

test('user will have their data updated when logging in', async (t) => {
    t.plan(3)
    const user = generateUser()
    const user2 = generateUser()
    user2.id = user.id
    const app = makeApp(user)
    let res = await request(app)
        .get('/')
    t.is(res.status, 200)

    const person = await knex('person')
        .select()
        .where('email', user.email)
        .where('lastname', user.surname)
        .where('firstname', user.firstname)
        .first()

    const app2 = makeApp(user2)
    res = await request(app2)
        .get('/')
    t.is(res.status, 200)

    const updatedPerson = await knex('person')
        .select()
        .where('personId', person.personId)
        .first()

    t.deepEqual(updatedPerson,
        Object.assign(person,
            {
                firstname: user2.firstname,
                lastname: user2.surname,
                shibbolethId: user2.id,
                email: user2.email
            }
        ))
})
