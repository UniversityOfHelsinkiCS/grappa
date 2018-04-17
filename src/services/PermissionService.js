import Promise from 'bluebird'

import { getLoggedPerson } from './PersonService'
import { getStudyfieldsProgramme } from './ProgrammeService'
import { getAgreementPersonsByAgreementId, getUsersRoles } from './RoleService'

// TODO refactor

export async function checkUserHasRightToModifyAgreement(req, agreements) {
    const user = await getLoggedPerson(req)
    const roles = await getUsersRoles(user)

    if (isAdmin(roles)) {
        return
    }

    if (await hasStudyfieldRole(roles, agreements)) {
        return
    }

    if (await isAgreementPersonForThesis(user, agreements)) {
        return
    }

    throw new Error('User has no access to edit thesis')
}

export async function checkUserHasRightToSeeAgreement(req, agreements) {
    const user = await getLoggedPerson(req)
    const roles = await getUsersRoles(user)

    if (isAdmin(roles)) {
        return
    }

    if (await hasStudyfieldRole(roles, agreements)) {
        return
    }

    if (await isAgreementPersonForThesis(user, agreements)) {
        return
    }

    if (isAuthor(user, agreements)) {
        return
    }

    throw new Error('User has no access to download attachments')
}

function isAdmin(roles) {
    return !!roles.find(item => item.role.name === 'admin')
}

async function hasStudyfieldRole(roles, agreements) {
    const studyfieldRoles = ['manager', 'resp_professor', 'print_person']
    const thesisProgramme = await getStudyfieldsProgramme(agreements[0].studyfieldId)
    const studyfieldRole = roles
        .filter(item => item.programme.programmeId === thesisProgramme.programmeId)
        .find(item => studyfieldRoles.includes(item.role.name))

    return !!studyfieldRole
}

async function isAgreementPersonForThesis(user, agreements) {
    const agreementPersons = await Promise.map(
        agreements,
        agreement => getAgreementPersonsByAgreementId(agreement.agreementId)
    ).reduce((prev, cur) => prev.concat(cur), [])

    return !!agreementPersons.find(person => person.personId === user.personId)
}

function isAuthor(user, agreements) {
    if (agreements.length < 1) {
        return false
    }
    return !agreements.some(agreement => agreement.authorId !== user.personId)
}
