const knex = require('../db/connection');

const programmeSchema = [
    'programme.programmeId',
    'programme.name',
    'programme.facultyId'
];

export const getAllProgrammes = () =>
    knex.select(programmeSchema).from('programme').then(programme => programme);

export const getProgrammeId = name =>
    knex.select(programmeSchema).from('programme').where('name', name).first();

export const getProgramme = programmeId =>
    knex.select(programmeSchema).from('programme').where('programmeId', programmeId).first();

export const getStudyfieldsProgramme = studyfieldId =>
    knex.select(programmeSchema).from('programme')
        .innerJoin('studyfield', 'programme.programmeId', '=', 'studyfield.programmeId')
        .where('studyfield.studyfieldId', studyfieldId)
        .first()