const knex = require('../db/connection');

const studyfieldSchema = [
    'studyfieldId',
    'studyfield.name',
    'studyfield.programmeId'
];

export const getStudyfields = async () => knex.select(studyfieldSchema).from('studyfield');

export const getStudyfield = async studyfieldId =>
    knex.select(studyfieldSchema).from('studyfield').where('studyfield.studyfieldId', studyfieldId).first();