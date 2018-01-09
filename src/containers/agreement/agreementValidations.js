export const getRequiredFields = (roles) => {
    if (roles === undefined)
        return [];
    const onlyRoles = roles.map((r) => r.role); //get only the role
    if (!onlyRoles.includes('supervisor') && onlyRoles[0] !== undefined) //TODO: remove when only student & supervisor can edit
        return [];
    if (onlyRoles[0] === undefined) {
        return requiredField.student; //if no role is defined then the user is a student
    } else {
        return requiredField.supervisor;
    }
}

const requiredField = {
    'student': ['thesisTitle', 'thesisStartDate', 'thesisPerformancePlace', 'studyfieldId', 'thesisSupervisorMain', 'studentGradeGoal'],
    'supervisor': ['thesisWorkSupervisorTime', 'thesisWorkMeetingAgreement']
}
