const knex = require('../db/connection');
const bookshelf = require('../db/bookshelf');
const Agreement = require('../db/models/agreement');

const agreementSchema = [
    'agreement.agreementId',
    'authorId',
    'agreement.thesisId',
    'responsibleSupervisorId',
    'agreement.studyfieldId',
    'fake',
    'startDate',
    'completionEta',
    'performancePlace',
    'studentGradeGoal',
    'studentWorkTime',
    'supervisorWorkTime',
    'intermediateGoal',
    'meetingAgreement',
    'other',
    'whoNext'
]

export const getAgreementById = (agreementId) => {
    return knex.select().from('agreement')
        .join('thesis', 'agreement.thesisId', '=', 'thesis.thesisId')
        .join('person', 'agreement.authorId', '=', 'person.personId')
        .join('studyfield', 'agreement.studyfieldId', '=', 'studyfield.studyfieldId')
        .where('agreementId', agreementId)
        .then(agreement => {
            return parseAgreementData(agreement[0])
        });
}

export const getAgreementsInStudyfield = (studyfieldId) => {
    return knex.select(agreementSchema).from('agreement')
        .where('studyfieldId', studyfieldId)
}

export const getAgreementsByAgreementPerson = (personId) => {
    return knex.select(agreementSchema).distinct('agreement.agreementId').from('agreement')
        .innerJoin('agreementPerson', 'agreement.agreementId', '=', 'agreementPerson.agreementId')
        .innerJoin('personWithRole', 'agreementPerson.personRoleId', '=', 'personWithRole.personRoleId')
        .where('personWithRole.personId', personId);
}

export const getPreviousAgreementById = (id) => {
    return knex.select().from('previousagreements')
        .join('agreement', 'previousagreements.previousAgreementId', '=', 'agreement.agreementId')
        .where('previousagreements.agreementId', id)
        .then(agreement => {
            return agreement;
        });
}

export const getAllAgreements = () => {
    return knex.select(agreementSchema).from('agreement')
}

export const getAgreementsByAuthor = (personId) => {
    return knex.select(agreementSchema).from('agreement')
        .where('authorId', personId)
}

export const saveAgreement = async (agreement) => {
    const agreementIds = await knex('agreement')
        .returning('agreementId')
        .insert(agreement)
    const agreementId = agreementIds[0]
    return knex.select(agreementSchema).from('agreement').where('agreementId', agreementId).first()
}

export const createFakeAgreement = () => {
    const fakeAgreement = {
        authorId: null,
        thesisId: null,
        responsibleSupervisorId: null,
        studyfieldId: null,
        fake: true,
        startDate: null,
        completionEta: null,
        performancePlace: null,
        studentGradeGoal: null,
        studentWorkTime: null,
        supervisorWorkTime: null,
        intermediateGoal: null,
        meetingAgreement: null,
        other: null,
        whoNext: null
    }

    return saveAgreement(fakeAgreement)
}

export const updateAgreement = (agreement) => {
    return knex('agreement')
        .returning('agreementId')
        .where('agreementId', '=', agreement.agreementId)
        .update(agreement)
        .then(agreementId =>
            knex.select(agreementSchema).from('agreement')
                .where('agreementId', '=', agreement.agreementId)
                .first()
        ).catch(error => {
            throw error
        });
}

export const savePrevious = (data) => {
    return knex('previousagreements')
        .returning('agreementId')
        .insert(data)
        .then(agreementId => agreementId[0])
        .catch(error => {
            throw error
        });
}

//change data formatting from DB to front
const parseAgreementData = (data) => {
    let parsed = {
        //person
        personId: data.personId,
        studentFirstName: data.firstname,
        studentLastName: data.lastname,
        studentNumber: data.studentNumber,
        studentAddress: data.address,
        studentPhone: data.phone,
        studentEmail: data.email,
        studentMajor: data.major,
        //thesis
        thesisTitle: data.thesisTitle,
        thesisStartDate: data.startDate,
        thesisCompletionEta: data.completionEta,
        thesisPerformancePlace: data.performancePlace,
        //agreement
        agreementId: data.agreementId,
        authorId: data.personId,
        thesisId: data.thesisId,
        responsibleSupervisorId: data.responsibleSupervisorId,
        studyfieldId: data.studyfieldId,
        studentGradeGoal: data.studentGradeGoal,
        thesisWorkStudentTime: data.studentWorkTime,
        thesisWorkSupervisorTime: data.supervisorWorkTime,
        thesisWorkIntermediateGoal: data.intermediateGoal,
        thesisWorkMeetingAgreement: data.meetingAgreement,
        thesisWorkOther: data.other
    }
    return parsed;
}

/*
Figures out who should next receive the agreement for approval,
this requires the program to be able to know who sent the agreement update
by tracking personId's. After that agreement also needs a finished attribute and
some way to know which people have approved the agreement to keep track of where
in the agreement approval process we are at.
*/
//REDO THIS LATER
export const getAgreementReceiver = (id) => {
    console.log('getAgreementReceiver', id);
    return knex.select('whoNext').from('agreement')
        .where('agreementId', id)
        .then(agreement => {
            console.log('whoNext', agreement[0].whoNext)
            if (agreement[0].whoNext === 'supervisor') {
                return 'student';
            } else {
                return 'supervisor';
            }
        });
}
