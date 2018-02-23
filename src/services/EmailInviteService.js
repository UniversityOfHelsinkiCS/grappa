const crypto = require('crypto')
const Checkit = require('checkit')
const knex = require('../db/connection').getKnex()

const emailService = require('./EmailService')

const roleInviteType = new Checkit({
    programme: ['required'],
    role: ['required'],
    email: ['required', 'email']
})

const authorInviteType = new Checkit({
    email: ['required', 'email'],
    agreement: ['required']
})

function generateToken() {
    return crypto.randomBytes(16).toString('hex')
}

export async function createEmailInviteForThesisAuthor(email, agreementId, programmeId, trx) {
    const token = generateToken()
    const invite = { email, agreement: agreementId, token, type: 'thesis_author' }

    if (authorInviteType.validateSync(invite)[0]) throw new Error('Invalid parameters')

    await knex('emailInvite').insert(invite).transacting(trx)
    await emailService.sendInvite(invite, 'thesis', programmeId)
}

export async function createEmailInviteForRole(inviteData) {
    if (roleInviteType.validateSync(inviteData)[0]) throw new Error('Invalid parameters')

    const { programme, role, email } = inviteData
    const token = generateToken()
    const invite = { email, role, programme, token, type: 'role' }
    await knex('emailInvite').insert(invite)
    await emailService.sendInvite(invite, 'role', programme)
}

export function getEmailInviteDataForToken(token) {
    return knex('emailInvite')
        .select()
        .where('token', token)
        .where('used', false)
        .first()
}

export function markTokenUsed(token) {
    return knex('emailInvite').update({ used: true }).where('token', token)
}
