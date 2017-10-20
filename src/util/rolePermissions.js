export const getPermissions = (role, context, method) => {
    if (!(role && context && method))
        return undefined;
    return permissions[role][context][method];
}

const permissions = {
    'supervisor': {
        'agreement': {
            'edit': ['thesisCompletionEta', 'thesisWorkStudentTime', 'thesisWorkIntermediateGoal', 'thesisWorkMeetingAgreement', 'thesisSupervisorSecond', 'thesisSupervisorOther', 'thesisWorkSupervisorTime', 'thesisWorkMeetingAgreement', 'thesisWorkOther']
        }
    },
    'student': {
        'agreement': {
            'create': ['studentAddress', 'studentEmail', 'studentAddress', 'studentName', 'studentPhone', 'thesisCompletionEta', 'thesisWorkStudentTime', 'thesisWorkIntermediateGoal', 'thesisWorkMeetingAgreement', 'thesisWorkOther'],
            'edit': ['thesisCompletionEta', 'thesisWorkStudentTime', 'thesisWorkIntermediateGoal', 'thesisWorkMeetingAgreement', 'thesisSupervisorPrimary', 'thesisSupervisorSecond', 'thesisSupervisorOther', 'thesisWorkSupervisorTime', 'thesisWorkMeetingAgreement', 'thesisWorkOther']
        }
    }
}
