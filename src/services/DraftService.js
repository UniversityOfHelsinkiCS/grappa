const knex = require('../../connection');

export const getAgreementDraftById = (id) => {
    return knex.select().from('agreementDraft').where('agreementDraftId', id)
        .then(agreementDraft => {
            return agreementDraft;
        })
        .catch(error => {
            throw error;
        })
}

export const saveNewAgreementDraft = (data) => {
    return knex('agreementDraft')
        .returning('agreementDraftId')
        .insert(data)
        .then(agreementDraftId => agreementDraftId[0])
        .catch(err => err);
}

export const updateAgreementDraft = (data) => {
    return knex('agreementDraft')
    .returning('agreementDraftId')
    .where('agreementDraftId', '=', data.agreementDraftId)
    .update(data)
    .then(agreementDraftId => agreementDraftId)
    .catch(err => err);
}

export const saveAgreementDraftPerson = (data) => {
    return knex('agreementDraftPerson')
        .returning('personRoleId')
        .insert(data)
        .then(personRoleId => personRoleId[0])
        .catch(err => err);
}

export const getAgreementDraftPersonByIds = (agreementDraftId, personRoleId) => {
    return knex.select().from('agreementDraftPerson')
        .where('agreementDraftId', id)
        .andWhere('personRoleId', personRoleId)
        .then(agreementDraftPerson => {
            return agreementDraftPerson;
        })
        .catch(error => {
            throw error;
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
