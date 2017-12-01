const knex = require('../db/connection');

export const getAllStudyfields = () => {
    return knex.select('studyfieldId', 'name').from('studyfield')
        .then(studyfield => studyfield);
}
