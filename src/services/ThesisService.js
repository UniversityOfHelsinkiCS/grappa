const knex = require('../db/connection').getKnex()
const moment = require('moment')

const agreementService = require('./AgreementService')
const personService = require('./PersonService')
const roleService = require('./RoleService')
const Thesis = require('../db/models/thesis')

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
export const getAllTheses = async () => {
    const theses = await Thesis.fetchAll({ withRelated: ['authors'] }).then(res => res.serialize())
    return getGradersForTheses(theses)
}

// In cases we need theses for a person (student)
export const getThesesByPersonId = async (personId) => {
    const theses = await knex
        .select(thesisSchema)
        .from('thesis')
        .join('agreement', 'thesis.thesisId', '=', 'agreement.thesisId')
        .where('agreement.authorId', personId)
    return getGradersForTheses(theses)
}

// In cases we need theses for a programme (resp_prof)
export const getThesesInProgramme = async (programmeId) => {
    const theses = await knex.select(thesisSchema).from('thesis')
        .innerJoin('agreement', 'thesis.thesisId', '=', 'agreement.thesisId')
        .innerJoin('studyfield', 'agreement.studyfieldId', '=', 'studyfield.studyfieldId')
        .where('studyfield.programmeId', programmeId)
        .where('agreement.startDate', '>', moment().subtract(10, 'years'))
    return getGradersForTheses(theses)
}

// In cases we need theses for a supervisor/grader
export const getThesesByAgreementPerson = async (personId) => {
    const theses = await knex.distinct('thesis.thesisId').select(thesisSchema).from('personWithRole')
        .where('personWithRole.personId', personId)
        .innerJoin('agreementPerson', 'agreementPerson.personRoleId', '=', 'personWithRole.personRoleId')
        .innerJoin('agreement', 'agreement.agreementId', '=', 'agreementPerson.agreementId')
        .innerJoin('thesis', 'thesis.thesisId', '=', 'agreement.thesisId')
    return getGradersForTheses(theses)
}

export const getThesisById = async (thesisId) => {
    const thesis = await knex.select(thesisSchema)
        .from('thesis')
        .where('thesisId', thesisId)
        .first()
    return getGradersForTheses([thesis])
}

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


export const getGradersForTheses = async theses => (
    Promise.all(theses.map(async (thesis) => {
        const agreements = await agreementService.getAgreementsByThesisId(thesis.thesisId)
        const graders = []
        const graderRole = await roleService.getRoleId('grader')
        await Promise.all(agreements.map(async (agreement) => {
            const confirmedGraders = await personService.getPersonsByAgreementId(agreement.agreementId, graderRole)
            const pendingGraders = await personService.getPendingPersonsByAgreement(agreement.agreementId, graderRole)
            graders.push(...confirmedGraders, ...pendingGraders)
        }
        ))
        return Object.assign({ graders }, thesis)
    }))
)
