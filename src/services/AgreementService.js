const mockAgreements = require('../mockdata/MockAgreements');
const knex = require('../../connection');

export const getAgreementById = (id) => {
    return knex.select().from('agreement').where('agreementId', id)
        .then(agreement => {
            return agreement;
        });
}

export const getAllAgreements = () => {
    return knex.select().from('agreement')
        .then(agreements => {
            return agreements;
        });
}

export const saveNewAgreement = (data) => {
    return knex('agreement')
        .returning('agreementId')
        .insert(data)
        .then(agreementId => agreementId[0])
        .catch(err => err);
}

export const updateAgreement = (data) => {
    return knex('agreement')
        .returning('agreementId')
        .where('agreementId', '=', data.agreementId)
        .update(data)
        .then(agreementId => agreementId[0])
        .catch(err => err);
}
