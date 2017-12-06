const knex = require('../db/connection');
const bookshelf = require('../db/bookshelf')
const Thesis = require('../db/models/thesis');

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

export const getThesisById = (thesisId) => {
    return Thesis.where({ thesisId }).fetchAll();
    /*
  return knex.select().from('thesis').where('thesisId', id) 
      .then(thesis => thesis)
      .catch(error => {
          throw error;
      });*/
}

export const saveThesis = (thesis) => {
    return Thesis.forge(thesis).save().then(model => {
        return model.fetch();
    }).catch(error => {
        throw error;
    })
    /*return knex('thesis')
        .insert(thesis)
        .returning('*')
        .then(theses => 12)
        .catch(error => {
            throw error;
        });
        */
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
