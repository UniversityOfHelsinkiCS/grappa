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
    thesis: {path: '/thesis', text: 'New thesis'},
    assesment: { path: '/assesment', text: 'Assesment of theses'},
    councilMeeting: { path: '/councilmeeting', text: 'Next councilmeeting' },
    councilMeetings: { path: '/councilmeetings', text: 'Councilmeetings' },
    emailDrafts: { path: '/emaildrafts', text: 'Email drafts' }
}

const permissions = {
    //Supervisor
    'supervisor': {
        'nav-bar': {
            show: [
                nav['home'], nav['agreementForm'], nav['agreement'], nav['theses'], nav['assesment']
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
                nav['home'], nav['agreementForm'], nav['agreement'], nav['theses'], nav['assesment']
            ]
        }
    },
    //Student
    'student': {
        'nav-bar': {
            show: [
                nav['home'], nav['agreementForm'], nav['agreement'], nav['thesis'], nav['assesment']
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
                nav['home'], nav['agreementForm'], nav['agreement'], nav['theses'], nav['graderManagement'], nav['assesment']
            ]
        }
    },
    //Admin
    'admin': {
        'nav-bar': {
            show: [
                nav['home'], nav['agreementForm'], nav['agreement'], nav['theses'], nav['graderManagement'], nav['thesis'], nav['assesment'], nav['councilMeeting'], nav['councilMeetings'], nav['emailDrafts']
            ]
        }
    }
}
