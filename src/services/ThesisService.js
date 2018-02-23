const knex = require('../db/connection').getKnex()
const moment = require('moment')

const thesisSchema = [
    'thesis.thesisId',
    'thesis.title',
    'thesis.councilmeetingId',
    'urkund',
    'grade',
    'printDone'
]

// In case we need all theses
// Restricted to show only last 10 years thesis
export function getAllTheses() {
    return knex.select(thesisSchema)
        .innerJoin('agreement', 'thesis.thesisId', 'agreement.thesisId')
        .where('agreement.startDate', '>', moment().subtract(10, 'years'))
        .from('thesis')
}

// In cases we need theses for a person (student)
export function getThesesByPersonId(personId) {
    return knex
        .select(thesisSchema)
        .from('thesis')
        .join('agreement', 'thesis.thesisId', '=', 'agreement.thesisId')
        .where('agreement.authorId', personId)
}

// In cases we need theses for a programme (resp_prof)
export function getThesesInProgramme(programmeId) {
    return knex.select(thesisSchema).from('thesis')
        .innerJoin('agreement', 'thesis.thesisId', '=', 'agreement.thesisId')
        .innerJoin('studyfield', 'agreement.studyfieldId', '=', 'studyfield.studyfieldId')
        .where('studyfield.programmeId', programmeId)
        .where('agreement.startDate', '>', moment().subtract(10, 'years'))
}

// In cases we need theses for a supervisor/grader
export function getThesesByAgreementPerson(personId) {
    return knex.distinct('thesis.thesisId').select(thesisSchema).from('personWithRole')
        .where('personWithRole.personId', personId)
        .innerJoin('agreementPerson', 'agreementPerson.personRoleId', '=', 'personWithRole.personRoleId')
        .innerJoin('agreement', 'agreement.agreementId', '=', 'agreementPerson.agreementId')
        .innerJoin('thesis', 'thesis.thesisId', '=', 'agreement.thesisId')
}

export const getThesisById = thesisId => knex.select(thesisSchema).from('thesis')
    .where('thesisId', thesisId).first()

export const saveThesis = async (thesis, trx) => {
    const thesisIds = await knex('thesis')
        .returning('thesisId')
        .insert(thesis)
        .transacting(trx)

    const thesisId = thesisIds[0]
    return knex
        .select(thesisSchema)
        .from('thesis')
        .where('thesisId', thesisId)
        .first()
        .transacting(trx)
}

export const updateThesis = async (thesisData, trx) => knex('thesis')
    .where('thesisId', thesisData.thesisId)
    .update(thesisData)
    .transacting(trx)
    .then(() => getThesisById(thesisData.thesisId))

export const markPrinted = thesisIds => knex('thesis')
    .update({ printDone: true })
    .whereIn('thesisId', thesisIds)
