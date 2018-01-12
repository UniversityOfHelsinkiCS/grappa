const knex = require('../db/connection');

const thesisSchema = [
    'thesis.thesisId',
    'thesis.title',
    'thesis.councilmeetingId',
    'urkund',
    'grade',
    'graderEval',
    'printDone'
];

// In case we need all theses
export function getAllTheses() {
    return knex.select(thesisSchema).from('thesis');
}

// In cases we need theses for a person (student)
export function getThesesByPersonId(personId) {
    return knex
        .select(thesisSchema)
        .from('thesis')
        .join('agreement', 'thesis.thesisId', '=', 'agreement.thesisId')
        .where('agreement.authorId', personId);
}

// In cases we need theses for a studyfield (resp_prof)
export function getThesesByStudyfield(studyfieldId) {
    return knex.select(thesisSchema).from('thesis')
        .innerJoin('agreement', 'thesis.thesisId', '=', 'agreement.thesisId')
        .where('agreement.studyfieldId', studyfieldId);
}

// In cases we need theses for a supervisor/grader
export function getThesesByAgreementPerson(personId) {
    return knex.distinct('thesis.thesisId').select(thesisSchema).from('personWithRole')
        .where('personWithRole.personId', personId)
        .innerJoin('agreementPerson', 'agreementPerson.personRoleId', '=', 'personWithRole.personRoleId')
        .innerJoin('agreement', 'agreement.agreementId', '=', 'agreementPerson.agreementId')
        .innerJoin('thesis', 'thesis.thesisId', '=', 'agreement.thesisId');
}

export const getThesisById = (thesisId) => {
    return knex.select(thesisSchema).from('thesis')
        .where('thesisId', thesisId).first();
};

export const saveThesis = async (thesis) => {
    const thesisIds = await knex('thesis')
        .returning('thesisId')
        .insert(thesis);
    const thesisId = thesisIds[0];
    return knex.select(thesisSchema).from('thesis').where('thesisId', thesisId).first();
};

export const updateThesis = async (thesisData) => {
    return knex('thesis')
        .where('thesisId', '=', thesisData.thesisId)
        .update(thesisData)
        .then(() => {
            return getThesisById(thesisData.thesisId);
        }).catch(error => {
            throw error;
        });
};
