const knex = require('../db/connection');

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
        studyfield: emailDraft.studyfield
    })
        .returning('emailDraftId')
        .then(emailDraftId => emailDraftId[0]);
}

export async function updateEmailDraft(emailDraftId, emailDraft) {
    return knex('emailDraft').update({
        title: emailDraft.title,
        body: emailDraft.body,
        studyfield: emailDraft.studyfield
    }).where('emailDraftId', emailDraftId);
}

export async function deleteEmailDraft(draftId) {
    return knex('emailDraft').delete().where('emailDraftId', draftId);
}

export async function getEmailDraft(type, studyfield) {
    return knex('emailDraft')
        .select()
        .where('type', type)
        .where(function() {
            if (studyfield) {
                this
                    .where('studyfield', studyfield)
                    .orWhereNull('studyfield')
                    .orderBy('studyfield');
            } else {
                this.whereNull('studyfield');
            }
        })
        .first();
}
