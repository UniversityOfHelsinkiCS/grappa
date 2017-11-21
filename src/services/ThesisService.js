const knex = require('../../connection');

export function getAllTheses() {
    return knex.distinct('thesis.thesisId').select('thesis.thesisId', 'thesis.thesisTitle', 'thesis.grade', 'person.firstName as authorFirstname', 'person.lastName as authorLastname').from('thesis')
        .leftJoin('agreement', 'thesis.thesisId', '=', 'agreement.thesisId')
        .leftJoin('person', 'thesis.userId', '=', 'person.personId')
        .then(thesis => thesis);
}

export const getThesisById = (id) => {
    return knex.select().from('thesis').where('thesisId', id)
        .then(thesis => thesis);
}

export const saveThesis = (data) => {
    return knex('thesis')
    .returning('thesisId')
    .insert(data)
    .then(thesisId => thesisId[0])
    .catch(err => Promise.reject(err));
}

export async function updateThesis(thesisData) {
    return await knex('thesis')
    .returning('thesisId')
    .where('thesisId', '=', thesisData.thesisId)
    .update(thesisData)
    .then(thesisId => thesisId[0])
    .catch(err => err);
}
