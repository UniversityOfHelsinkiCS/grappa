import { paths as nav } from './routes'

export const getPermissions = (role, context, method) => {
    if (!(role && context && method))
        return undefined;
    return permissions[role][context][method];
}

export const userRoles = ['student', 'supervisor', 'resp_professor', "other_supervisor", 'admin']

const permissions = {
    //Supervisor
    'supervisor': {
        'nav-bar': {
            show: [
                nav['home'], nav['agreement'], nav['theses'], nav['assesment']
            ]
        },
        'agreement': {
            'edit': ['thesisCompletionEta', 'thesisWorkStudentTime', 'thesisWorkIntermediateGoal', 'thesisWorkMeetingAgreement', 'thesisSupervisorSecond', 'thesisSupervisorOther', 'thesisWorkSupervisorTime', 'thesisWorkMeetingAgreement', 'thesisWorkOther']
        }
    },
    //Other Supervisor
    'other': {
        'nav-bar': {
            show: [
                nav['home'], nav['agreement'], nav['theses'], nav['assesment']
            ]
        }
    },
    //Student
    'author': {
        'nav-bar': {
            show: [
                nav['home'], nav['agreement'], nav['thesis'], nav['assesment']
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
                nav['home'], nav['agreement'], nav['theses'], nav['supervisorManagement'], nav['assesment']
            ]
        }
    },
    //Admin
    'admin': {
        'nav-bar': {
            show: [
                nav.home, nav.agreement, nav.theses, nav.supervisorManagement, nav.thesis, nav.assesment, nav.councilMeeting, nav.councilMeetings, nav.emailDrafts, nav.statistics
            ]
        },
        'agreement': {
            'create': ['studentAddress', 'studentEmail', 'studentAddress', 'studentName', 'studentPhone', 'thesisCompletionEta', 'thesisWorkStudentTime', 'thesisWorkIntermediateGoal', 'thesisWorkMeetingAgreement', 'thesisWorkOther'],
            'edit': ['thesisCompletionEta', 'thesisWorkStudentTime', 'thesisWorkIntermediateGoal', 'thesisWorkMeetingAgreement', 'thesisSupervisorPrimary', 'thesisSupervisorSecond', 'thesisSupervisorOther', 'thesisWorkSupervisorTime', 'thesisWorkMeetingAgreement', 'thesisWorkOther']
        }
    }
}
