import test from 'ava'
import knex from '../../src/db/connection'

process.env.DB_SCHEMA = 'attachment_test'

const { initDb, makeTestApp } = require('../utils')

const request = require('supertest')
const attachment = require('../../src/routes/attachments')

const makeApp = async (id) => {
    return makeTestApp('/attachments', id, attachment)
}

test.before(async () => {
    await initDb()
})

test('attachment post & creates id', async (t) => {
    const agreementId = 1
    const res = await request(await makeApp(1))
        .post('/attachments')
        .field('json', JSON.stringify({ agreementId }))
        .attach('otherFile', './LICENSE')
    t.is(res.status, 200)
    const attachments = res.body
    t.is(attachments.length, 1)
    t.is(attachments[0].agreementId, agreementId, 'Attachment linked to given agreementId')
})

test('attachment post permissions checked', async (t) => {
    const person = await knex.getKnex()('person')
        .insert({ firstname: 'test', lastname: 'test', shibbolethId: 'permission123' })
        .returning('personId')

    const agreementId = 1
    const res = await request(await makeApp(person[0]))
        .post('/attachments')
        .field('json', JSON.stringify({ agreementId }))
        .attach('otherFile', './LICENSE')

    t.is(res.status, 500)
})

test('attachment permissions are checked on delete', async (t) => {
    const agreementId = 1
    const res1 = await request(await makeApp(1))
        .post('/attachments')
        .field('json', JSON.stringify({ agreementId }))
        .attach('otherFile', './LICENSE')
    t.is(res1.status, 200)
    const person = await knex.getKnex()('person')
        .insert({ firstname: 'test', lastname: 'test', shibbolethId: 'permission2' })
        .returning('personId')
    const res2 = await request(await makeApp(person[0]))
        .del(`/attachments/${res1.body[0].attachmentId}`)
    t.is(res2.status, 500)
})

test('attachment can be deleted', async (t) => {
    const agreementId = 1
    const res1 = await request(await makeApp(1))
        .post('/attachments')
        .field('json', JSON.stringify({ agreementId }))
        .attach('otherFile', './LICENSE')

    const attachments = res1.body
    t.is(attachments.length, 1)

    const res2 = await request(await makeApp(1))
        .del(`/attachments/${res1.body[0].attachmentId}`)

    t.is(res2.status, 200)
})

const createAttachment = async () => {
    const agreementId = 1
    const res1 = await request(await makeApp(1))
        .post('/attachments')
        .field('json', JSON.stringify({ agreementId }))
        .attach('otherFile', './LICENSE')

    return res1.body[0].attachmentId
}

test('attachment download permissions are checked', async (t) => {
    const person = await knex.getKnex()('person')
        .insert({ firstname: 'tester', lastname: 'test', shibbolethId: 'attachmentPermissionsId' })
        .returning('personId')

    const attachmentId = await createAttachment()

    const res1 = await request(await makeApp(person[0]))
        .get(`/attachments/${attachmentId}`)

    t.is(res1.status, 403)

    // Grant print_person role for user
    await knex.getKnex()('personWithRole').insert({ programmeId: 1, personId: person[0], roleId: 3 })

    const res2 = await request(await makeApp(person[0]))
        .get(`/attachments/${attachmentId}`)

    t.is(res2.status, 501) // PDF printing fails, but user has access
})
