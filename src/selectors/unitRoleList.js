import { createSelector } from 'reselect'

const getPersons = state => state.persons
const getRoles = state => state.roles
const getUser = state => state.user

export const makeGetRolesInUnits = () => {
    return createSelector(
        [getUser, getRoles, getPersons],
        (user, roles, persons) =>
            formatForList(user, roles, persons)
    )
}

const formatForList = (user, roles, persons) => {
    if (!user || roles.length === 0 || persons.length === 0) {
        return []
    }
    const formatted = user.roles.filter(userRole =>
        userRole.role === 'manager')
        .map(userRole => roles
            .filter(role => role.programmeId === userRole.programmeId)
            .reduce((acc, cur) => {
                if (!acc[cur.name]) {
                    acc[cur.name] = []
                }
                acc[cur.name].push(Object.assign({ personRoleId: cur.personRoleId }, persons.find(person => person.personId === cur.personId)))
                return acc
            }, { name: userRole.programme })
        )
    return formatted
}