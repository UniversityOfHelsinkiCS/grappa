const knex = require('../db/connection');

export const getAllStudyfields = () => {
    return knex.select('studyfieldId', 'name').from('studyfield')
        .then(studyfield => studyfield);
}

export const getStudyfield = (studyfieldId) => {
    return knex.select().from('studyfield').where('studyfieldId', studyfieldId).first();
}