import { createSelector } from 'reselect'

const getPersonRoles = state => state.roles

export const makePersonRoles = () => createSelector(
    [getPersonRoles],
    (roles) => {
        const rolesByPerson = roles.reduce((personRoles, role) => {
            (personRoles[role.personId] = personRoles[role.personId] || []).push(role)
            return personRoles
        }, {})

        const personRoles = Object.keys(rolesByPerson).map((personId) => {
            const personRoles = rolesByPerson[personId]
            const roleMap = new Map()

            personRoles.forEach((role) => {
                const key = `${role.name}-${role.programmeId}`

                if (roleMap.get(key)) {
                    roleMap.get(key).agreementIds.push(role.agreementId)
                } else {
                    const agreementIds = role.agreementId ? [role.agreementId] : []
                    roleMap.set(key, Object.assign({ agreementIds }, role))
                }
            })

            return [...roleMap.values()]
        })

        return personRoles.reduce((a, b) => a.concat(b), [])
    }
)
