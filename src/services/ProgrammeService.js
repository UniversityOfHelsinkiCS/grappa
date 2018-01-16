const knex = require('../db/connection');

const programmeSchema = [
    'programmeId',
    'name',
    'facultyId'
];

export const getAllProgrammes = () =>
    knex.select(programmeSchema).from('programme').then(programme => programme);

export const getProgrammeId = name =>
    knex.select(programmeSchema).from('programme').where('name', name).first();

export const getProgramme = programmeId =>
    knex.select(programmeSchema).from('programme').where('programmeId', programmeId).first();
