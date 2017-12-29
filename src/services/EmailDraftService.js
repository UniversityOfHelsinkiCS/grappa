const knex = require('../db/connection');

export async function getEmailDrafts() {
    return knex.select().table('emailDraft');
}
