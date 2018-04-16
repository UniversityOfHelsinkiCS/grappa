const knex = require('../src/db/connection')
const jwt = require('jsonwebtoken')
const config = require('../src/util/config')
const errorHandler = require('../src/util/errorHandler')
const express = require('express')
const auth = require('../src/middleware/auth')

export async function createPerson(email) {
    const person = {
        email,
        firstname: 'Olli O',
        lastname: 'Opiskelija',
        shibbolethId: email
    }
    const insert = await knex.getKnex()('person')
        .returning('personId')
        .insert(person)
    person.personId = insert[0]

    await knex.getKnex()('person').update({ shibbolethId: person.personId }).where('personId', person.personId)

    return person
}

export const deleteFromDb = async (connection) => {
    await connection('meetingProgramme').del()
    await connection('previousagreements').del()
    await connection('agreementDraftPerson').del()
    await connection('agreementDraft').del()
    await connection('notification').del()
    await connection('emailDraft').del()
    await connection('attachment').del()
    await connection('agreementPerson').del()
    await connection('emailInvite').del()
    await connection('agreement').del()
    await connection('thesis').del()
    await connection('personWithRole').del()
    await connection('person').del()
    await connection('role').del()
    await connection('councilmeeting').del()
    await connection('studyfield').del()
    await connection('programme').del()
    await connection('faculty').del()

    await connection.raw('alter sequence "agreementDraft_agreementDraftId_seq" restart with 4')
    await connection.raw('alter sequence "agreement_agreementId_seq" restart with 4')
    await connection.raw('alter sequence "attachment_attachmentId_seq" restart with 2')
    await connection.raw('alter sequence "councilmeeting_councilmeetingId_seq" restart with 2')
    await connection.raw('alter sequence "notification_notificationId_seq" restart with 2')
    await connection.raw('alter sequence "personWithRole_personRoleId_seq" restart with 17')
    await connection.raw('alter sequence "person_personId_seq" restart with 20')
    await connection.raw('alter sequence "programme_programmeId_seq" restart with 9')
    await connection.raw('alter sequence "studyfield_studyfieldId_seq" restart with 8')
    await connection.raw('alter sequence "thesis_thesisId_seq" restart with 5')
}

export async function initDb() {
    const schema = process.env.DB_SCHEMA
    const connection = knex.getKnex()

    await connection.raw(`drop schema if exists ${schema} cascade`)
    await connection.raw(`create schema ${schema}`)
    await connection.migrate.latest()
    await deleteFromDb(connection)
    await connection.seed.run()
}

export const createToken = (userId) => {
    const payload = { userId }
    const token = jwt.sign(payload, config.TOKEN_SECRET, {
        expiresIn: '24h'
    })
    return token
}

export const makeTestApp = async (route, userId, ...handler) => {
    const app = express()
    const shibId = (await knex.getKnex().select().from('person').where('personId', userId)
        .first()).shibbolethId
    app.use(errorHandler)
    app.use(route, (req, res, next) => {
        req.headers['x-access-token'] = createToken(shibId)
        req.decodedToken = { shibId }
        next()
    }, auth.checkAuth, ...handler)
    return app
}
