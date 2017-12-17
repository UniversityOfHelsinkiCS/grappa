const knex = require('../db/connection');

export const getAgreementDraftById = (id) => {
    return knex.select().from('agreementDraft').where('agreementDraftId', id)
        .then(agreementDraft => {
            return agreementDraft[0];
        })
        .catch(error => {
            throw error;
        })
}

export const saveNewAgreementDraft = (data) => {
    return knex('agreementDraft')
        .returning('agreementDraftId')
        .insert(data)
        .then(agreementDraft => agreementDraft[0])
        .catch(err => {
            throw err;
        });
}


export const updateAgreementDraft = (data) => {
    return knex('agreementDraft')
    .returning('agreementDraftId')
    .where('agreementDraftId', '=', data.agreementDraftId)
    .update(data)
    .then(agreementDraft => agreementDraft)
    .catch(err => {
        throw err;
    });
}

export const saveAgreementDraftPerson = (data) => {
    return knex('agreementDraftPerson')
        .returning('personRoleId')
        .insert(data)
        .then(personRoleId => personRoleId)
        .catch(err => {
            throw err;
        });
}

export const removeAgreementDraftPersons = (agreementDraftId) => {
    return knex('agreementDraftPerson')
        .where('agreementDraftId', agreementDraftId)
        .del()
        .then(res => {
            return res;
        })
        .catch(err => {
            throw err;
        })
}

export const getAgreementDraftPersonsByAgreementDraftId = (id) => {
    return knex.select().from('agreementDraftPerson').where('agreementDraftId', id)
        .then(agreementDraftPerson => {
            return agreementDraftPerson;
        })
        .catch(error => {
            throw error;
        });
}
