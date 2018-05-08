const knex = require('../db/connection').getKnex()
const Programme = require('../db/models/programme')

const programmeSchema = [
    'programme.programmeId',
    'programme.name',
    'programme.facultyId'
]

export const getProgrammeById = async (id) => {
    return Programme.where('programmeId', id).fetch()
}

export const getAllProgrammes = () =>
    knex.select(programmeSchema).from('programme').then(programme => programme)

export const getStudyfieldsProgramme = studyfieldId =>
    knex.select(programmeSchema).from('programme')
        .innerJoin('studyfield', 'programme.programmeId', '=', 'studyfield.programmeId')
        .where('studyfield.studyfieldId', studyfieldId)
        .first()
