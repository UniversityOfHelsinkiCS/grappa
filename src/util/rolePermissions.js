export const getPermissions = (role, context, method) => {
    if (!(role && context && method))
        return undefined;
    return permissions[role][context][method];
}

const nav = {
    home: {path: '/', text: 'Homepage'},
    agreementForm: {path: '/agreementform', text: 'AgreementForm'},
    agreement: {path: '/agreement', text: 'Agreement'},
    theses: {path: '/theses', text: 'Theses'},
    graderManagement: {path: '/graderManagement', text: 'Supervisor management'},
    thesis: {path: '/thesis', text: 'New thesis'}
}

const permissions = {
    //Supervisor
    'supervisor': {
        'nav-bar': {
            show: [
                nav['home'], nav['agreementForm'], nav['agreement'], nav['theses']
            ]
        },
        'agreement': {
            'edit': ['thesisCompletionEta', 'thesisWorkStudentTime', 'thesisWorkIntermediateGoal', 'thesisWorkMeetingAgreement', 'thesisSupervisorSecond', 'thesisSupervisorOther', 'thesisWorkSupervisorTime', 'thesisWorkMeetingAgreement', 'thesisWorkOther']
        }
    },
    //Other Supervisor
    'other_supervisor': {
        'nav-bar': {
            show: [
                nav['home'], nav['agreementForm'], nav['agreement'], nav['theses']
            ]
        }
    },
    //Student
    'student': {
        'nav-bar': {
            show: [
                nav['home'], nav['agreementForm'], nav['agreement'], nav['thesis']
            ]
        },
        'agreement': {
            'create': ['studentAddress', 'studentEmail', 'studentAddress', 'studentName', 'studentPhone', 'thesisCompletionEta', 'thesisWorkStudentTime', 'thesisWorkIntermediateGoal', 'thesisWorkMeetingAgreement', 'thesisWorkOther'],
            'edit': ['thesisCompletionEta', 'thesisWorkStudentTime', 'thesisWorkIntermediateGoal', 'thesisWorkMeetingAgreement', 'thesisSupervisorPrimary', 'thesisSupervisorSecond', 'thesisSupervisorOther', 'thesisWorkSupervisorTime', 'thesisWorkMeetingAgreement', 'thesisWorkOther']
        }
    },
    //Responsible Professor
    'resp_professor': {
        'nav-bar': {
            show: [
                nav['home'], nav['agreementForm'], nav['agreement'], nav['theses'], nav['graderManagement']
            ]
        }
    },
    //Admin
    'admin': {
        'nav-bar': {
            show: [
                nav['home'], nav['agreementForm'], nav['agreement'], nav['theses'], nav['graderManagement'], nav['thesis']
            ]
        }
    }
}
