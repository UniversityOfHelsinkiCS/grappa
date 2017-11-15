const knex = require('../../connection');

export const getAgreementDraftById = (id) => {
    return knex.select().from('agreementDraft').where('agreementDraftId', id)
        .then(agreementDraft => {
            return parseAgreementDraftData(agreementDraft);
        })
        .catch(err =>{
            throw(err);
        });
}

export const getPersonRoleDraftsByAgreementDraftId = (id) => {
    return knex.select().from('personWithRole').where('agreementDraftId', id)
    .then(personsWithRole => {
        return personsWithRole;
    })
    .catch(err =>{
        throw(err);
    });
}


const parseAgreementDraftData = (data) => {
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
        responsibleSupervisorId: data.responsibleSupervisorId,
        studyFieldId: data.studyFieldId,
        studentGradeGoal: data.studentGradeGoal,
        thesisWorkStudentTime: data.studentWorkTime,
        thesisWorkSupervisorTime: data.supervisorWorkTime,
        thesisWorkIntermediateGoal: data.intermediateGoal,
        thesisWorkMeetingAgreement: data.meetingAgreement,
        thesisWorkOther: data.other
    }
    return parsed;
}