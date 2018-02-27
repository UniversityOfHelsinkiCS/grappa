import { createSelector } from 'reselect'

const getPersons = state => state.persons
const getRoles = state => state.roles
const getUser = state => state.user

export const makeGetRolesInUnits = () => createSelector(
    [getUser, getRoles, getPersons],
    (user, roles, persons) =>
        formatForList(user, roles, persons)
)

const formatForList = (user, roles, persons) => {
    if (!user || roles.length === 0 || persons.length === 0) {
        return []
    }

    return user.roles.filter(userRole => userRole.role === 'manager')
        .map(userRole => roles
            .filter(role => role.programmeId === userRole.programmeId)
            .reduce((acc, cur) => {
                const roleName = cur.name

                if (!acc[roleName]) {
                    acc[roleName] = []
                }

                if (!acc[roleName].find(role => role.personId === cur.personId)) {
                    const personData = persons.find(person => person.personId === cur.personId)
                    acc[roleName].push(Object.assign({ personRoleId: cur.personRoleId }, personData))
                }

                return acc
            }, { name: userRole.programme })
        )
}
