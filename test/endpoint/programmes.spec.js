import test from 'ava'

process.env.DB_SCHEMA = 'programme_test'

const { initDb, createToken } = require('../utils')
const request = require('supertest')
const express = require('express')
const index = require('../../src/routes/index')
const errorHandler = require('../../src/util/errorHandler')

const makeApp = (userId) => {
    const app = express()
    app.use('/', (req, res, next) => {
        req['x-access-token'] = createToken(userId)
        req.decodedToken = { userId }
        next()
    }, index)

    app.use(errorHandler)
    return app
}

test.before(async () => {
    initDb()
})

test('Initial test', async (t) => {
    t.plan(1)
    const app = makeApp()
    const res = await request(app)
        .get('/')
    t.is(res.status, 200)
})
