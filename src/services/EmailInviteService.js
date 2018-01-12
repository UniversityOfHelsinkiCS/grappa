const crypto = require('crypto');
const knex = require('../db/connection');

const emailService = require('./EmailService');

export async function createEmailInviteForThesisAuthor(email, agreementId, studyfieldId) {
    const token = crypto.randomBytes(16).toString('hex');
    const invite = { email, agreement: agreementId, token, type: 'thesis_author' };
    await knex('emailInvite').insert(invite);
    await emailService.sendInvite(invite, studyfieldId);
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
