const knex = require('../db/connection').getKnex();

export async function getEmailDrafts() {
    return knex.select().table('emailDraft');
}

export async function getEmailDraftById(emailDraftId) {
    return knex('emailDraft').select().where('emailDraftId', emailDraftId).first();
}

export async function saveEmailDraft(emailDraft) {
    return knex('emailDraft').insert({
        title: emailDraft.title,
        body: emailDraft.body,
        type: emailDraft.type,
        programme: emailDraft.programme
    })
        .returning('emailDraftId')
        .then(emailDraftId => emailDraftId[0]);
}

export async function updateEmailDraft(emailDraftId, emailDraft) {
    return knex('emailDraft').update({
        title: emailDraft.title,
        body: emailDraft.body,
        programme: emailDraft.programme
    }).where('emailDraftId', emailDraftId);
}

export async function deleteEmailDraft(draftId) {
    return knex('emailDraft').delete().where('emailDraftId', draftId);
}

export async function getEmailDraft(type, programme) {
    return knex('emailDraft')
        .select()
        .where('type', type)
        .where(function() {
            if (programme) {
                this
                    .where('programme', programme)
                    .orWhereNull('programme')
                    .orderBy('programme');
            } else {
                this.whereNull('programme');
            }
        })
        .first();
}
