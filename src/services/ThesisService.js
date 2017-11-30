const knex = require('../db/connection');
const bookshelf = require('../db/bookshelf')
const Thesis = require('../models/thesis');

export function getAllTheses() {
    return Thesis.fetchAll();
    /*return knex.distinct('thesis.thesisId').select('thesis.thesisId', 'thesis.thesisTitle', 'thesis.grade', 'person.firstName as authorFirstname', 'person.lastName as authorLastname').from('thesis')
        .leftJoin('agreement', 'thesis.thesisId', '=', 'agreement.thesisId')
        .leftJoin('person', 'thesis.userId', '=', 'person.personId')
        .then(thesis => thesis)
        .catch(error => {
            throw error;
        });*/
}

export const getThesisById = (id) => {
    return knex.select().from('thesis').where('thesisId', id) 
        .then(thesis => thesis)
        .catch(error => {
            throw error;
        });
}

export const saveThesis = (data) => {
    return knex('thesis')
    .returning('thesisId')
    .insert(data)
    .then(thesisId => thesisId[0])
    .catch(error => {
        throw error;
    });
}

export async function updateThesis(thesisData) {
    return await knex('thesis')
    .returning('thesisId')
    .where('thesisId', '=', thesisData.thesisId)
    .update(thesisData)
    .then(thesisId => thesisId[0])
    .catch(err => {
        throw error;
    });
}
