const crypto = require('crypto');
const knex = require('../db/connection');

const emailService = require('./EmailService');

function generateToken() {
    return crypto.randomBytes(16).toString('hex');
}

export async function createEmailInviteForThesisAuthor(email, agreementId, programmeId) {
    const token = generateToken();
    const invite = { email, agreement: agreementId, token, type: 'thesis_author' };
    await knex('emailInvite').insert(invite);
    await emailService.sendInvite(invite, 'thesis', programmeId);
}

export async function createEmailInviteForRole({ programme, role, email }) {
    const token = generateToken();
    const invite = { email, role, programme, token, type: 'role' };
    await knex('emailInvite').insert(invite);
    await emailService.sendInvite(invite, 'role', programme);
}

export function getEmailInviteDataForToken(token) {
    return knex('emailInvite')
        .select()
        .where('token', token)
        .where('used', false)
        .first();
}

export function markTokenUsed(token) {
    return knex('emailInvite').update({ used: true }).where('token', token);
}
