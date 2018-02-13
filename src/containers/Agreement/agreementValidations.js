export const getRequiredFields = (roles) => {
    if (roles === undefined)
        return []
    const onlyRoles = roles.map(r => r.role) // get only the role
    // TODO: remove when only student & supervisor can edit
    if (!onlyRoles.includes('supervisor') && onlyRoles[0] !== undefined)
        return []
    if (onlyRoles[0] === undefined) {
        return requiredField.student // if no role is defined then the user is a student
    }
    return requiredField.supervisor
}

const requiredField = {
    student: [
        'thesisTitle',
        'thesisStartDate',
        'thesisPerformancePlace',
        'programmeId',
        'thesisSupervisorMain',
        'studentGradeGoal'
    ],
    supervisor: ['thesisWorkSupervisorTime', 'thesisWorkMeetingAgreement']
}
