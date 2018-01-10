const crypto = require('crypto');
const knex = require('../db/connection');

export async function createEmailInviteForThesisAuthor(email, agreementId) {
    const code = crypto.randomBytes(64).toString('hex');
    return knex('emailInvite').insert({ email, agreement: agreementId, code, type: 'thesis_author' });
}
