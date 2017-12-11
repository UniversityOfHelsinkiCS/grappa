const knex = require('../db/connection');
const bookshelf = require('../db/bookshelf')
const Thesis = require('../db/models/thesis');

const thesisSchema = [
    "thesisId",
    "thesisTitle",
    "startDate",
    "completionEta",
    "performancePlace",
    "urkund",
    "grade",
    "graderEval",
    "userId"
]

export function getAllTheses() {
    //return Thesis.fetchAll();
    //must use joins before someone gets author names in some other way.
    return knex.distinct('thesis.thesisId').select('thesis.thesisId', 'thesis.thesisTitle', 'thesis.grade', 'person.firstName as authorFirstname', 'person.lastName as authorLastname')
        .from('thesis')
        .leftJoin('agreement', 'thesis.thesisId', '=', 'agreement.thesisId')
        .leftJoin('person', 'thesis.userId', '=', 'person.personId')
        .then(thesis => thesis)
        .catch(error => {
            throw error;
        });
}

export const getThesisById = (thesisId) => {
    return knex.select(thesisSchema).from('thesis').where('thesisId', thesisId).first();
}

export const saveThesis = (thesis) => {
    return Thesis.forge(thesis).save().then(model => {
        return model.fetch();
    }).then(model => {
        return model.attributes;
    }).catch(error => {
        throw error;
    })
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
