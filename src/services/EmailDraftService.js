const knex = require('../db/connection');

export async function getEmailDrafts() {
    return knex.select().table('emailDraft');
}

export async function saveEmailDraft() {
    throw new Error('not implemented');
}

export async function updateEmailDraft(emailDraftId, emailDraft) {
    return knex('emailDraft').update({
        title: emailDraft.title,
        body: emailDraft.body
    }).where('emailDraftId', emailDraftId);
}
