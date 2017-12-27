const knex = require('../db/connection');

const studyfieldSchema = [
    'studyfieldId',
    'name',
    'facultyId'
]

export const getAllStudyfields = () => {
    return knex.select(studyfieldSchema).from('studyfield')
        .then(studyfield => studyfield);
}

export const getStudyfieldId = (name) => {
    return knex.select(studyfieldSchema).from('studyfield').where('name', name).first();
}

export const getStudyfield = (studyfieldId) => {
    return knex.select(studyfieldSchema).from('studyfield').where('studyfieldId', studyfieldId).first();
}