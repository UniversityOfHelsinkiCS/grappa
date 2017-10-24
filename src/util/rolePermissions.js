export const getPermissions = (role, context, method) => {
    if (!(role && context && method))
        return undefined;
    return permissions[role][context][method];
}

const permissions = {
    'supervisor': {
        'nav-bar': {
            show: [
                {path: '/', text: 'Homepage'},
                {path: '/agreementform', text: 'AgreementForm'},
                {path: '/agreement', text: 'Agreement'},
                {path: '/theses', text: 'Theses'}
            ]
        },
        'agreement': {
            'edit': ['thesisCompletionEta', 'thesisWorkStudentTime', 'thesisWorkIntermediateGoal', 'thesisWorkMeetingAgreement', 'thesisSupervisorSecond', 'thesisSupervisorOther', 'thesisWorkSupervisorTime', 'thesisWorkMeetingAgreement', 'thesisWorkOther']
        }
    },
    'other_supervisor': {
        'nav-bar': {
            show: [
                {path: '/', text: 'Homepage'},
                {path: '/agreementform', text: 'AgreementForm'},
                {path: '/agreement', text: 'Agreement'},
                {path: '/theses', text: 'Theses'}
            ]
        }
    },
    'student': {
        'nav-bar': {
            show: [
                {path: '/', text: 'Homepage'},
                {path: '/agreementform', text: 'AgreementForm'},
                {path: '/agreement', text: 'Agreement'}
            ]
        },
        'agreement': {
            'create': ['studentAddress', 'studentEmail', 'studentAddress', 'studentName', 'studentPhone', 'thesisCompletionEta', 'thesisWorkStudentTime', 'thesisWorkIntermediateGoal', 'thesisWorkMeetingAgreement', 'thesisWorkOther'],
            'edit': ['thesisCompletionEta', 'thesisWorkStudentTime', 'thesisWorkIntermediateGoal', 'thesisWorkMeetingAgreement', 'thesisSupervisorPrimary', 'thesisSupervisorSecond', 'thesisSupervisorOther', 'thesisWorkSupervisorTime', 'thesisWorkMeetingAgreement', 'thesisWorkOther']
        }
    },
    'resp_professor': {
        'nav-bar': {
            show: [
                {path: '/', text: 'Homepage'},
                {path: '/agreementform', text: 'AgreementForm'},
                {path: '/agreement', text: 'Agreement'},
                {path: '/theses', text: 'Theses'},
                {path: '/graderManagement', text: 'Supervisor management'}
            ]
        }
    },
    'admin': {
        'nav-bar': {
            show: [
                {path: '/', text: 'Homepage'},
                {path: '/agreementform', text: 'AgreementForm'},
                {path: '/agreement', text: 'Agreement'},
                {path: '/theses', text: 'Theses'},
                {path: '/graderManagement', text: 'Supervisor management'}
            ]
        }
    }
}
