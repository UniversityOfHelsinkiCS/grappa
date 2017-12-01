const knex = require('../db/connection');

export const getAllStudyFields = () => {
    return knex.select('studyfieldId', 'name').from('studyfield')
        .then(studyfield => studyfield);
}
