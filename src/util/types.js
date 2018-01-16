import PropTypes from 'prop-types';

const { shape, string, number, text } = PropTypes;

export const personType = shape({
    personId: number,
    email: string,
    firstname: string,
    lastname: string,
    title: string,
    isRetired: number,
    studentNumber: string,
    address: string,
    phone: string,
    major: string
});

export const councilmeetingType = shape({
    councilmeetingId: number,
    date: string,
    instructorDeadline: string,
    studentDeadline: string
})

export const programmeType = shape({
    programmeId: number,
    name: text
});

export const availableRoleType = shape({
    roleId: number,
    name: text
})

export const roleType = shape({
    personRoleId: number,
    personId: number,
    programmeId: number,
    name: string,
    agreementId: number,
    statement: string
});

export const agreementType = shape({
    agreementId: number,
    authorId: number,
    thesisId: number,
    responsibleSupervisorId: number,
    programmeId: number,
    fake: number,
    startDate: string,
    completionEta: string,
    performancePlace: string,
    // studentGradeGoal: object,
    studentWorkTime: string,
    supervisorWorkTime: string,
    intermediateGoal: string,
    meetingAgreement: string,
    other: string,
    whoNext: string
});

export const attachmentType = shape({
    attachmentId: number,
    agreementId: number,
    filename: string,
    originalname: string,
    mimetype: string,
    label: string,
    savedOnDisk: number,
});

export const thesisType = shape({
    thesisId: number,
    title: string,
    urkund: string,
    grade: string,
    graderEval: string,
    printDone: number
});

export const emailType = shape({
    type: string,
    title: string,
    body: string,
    programme: number
});
