import Promise from 'bluebird'

import { getLoggedPerson } from './PersonService'
import { getStudyfieldsProgramme } from './ProgrammeService'
import { getAgreementPersonsByAgreementId, getUsersRoles } from './RoleService'

// TODO refactor

export const checkUserHasRightToAddAgreement = async (req, studyfieldId) => {
    const user = await getLoggedPerson(req)
    const roles = await getUsersRoles(user)

    if (isAdmin(roles)) {
        return
    }

    if (await hasStudyfieldRoleToAddThesis(roles, studyfieldId)) {
        return
    }

    throw new Error('User has no access to add thesis')
}

export const checkUserHasRightToModifyAgreement = async (req, agreements) => {
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

export const checkUserHasRightToSeeAgreement = async (req, agreements) => {
    const user = await getLoggedPerson(req)
    const roles = await getUsersRoles(user)

    if (isAdmin(roles)) {
        return
    }

    if (await isManagerRespProfOrPrintPerson(roles, agreements)) {
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

const isAdmin = roles => !!roles.find(item => item.role.name === 'admin')

const hasStudyfieldRoleToAddThesis = async (roles, studyfieldId) => {
    const studyfieldRoles = ['manager', 'resp_professor', 'supervisor', 'grader']
    const thesisProgramme = await getStudyfieldsProgramme(studyfieldId)
    const studyfieldRole = roles
        .filter(item => item.programme.programmeId === thesisProgramme.programmeId)
        .find(item => studyfieldRoles.includes(item.role.name))

    return !!studyfieldRole
}

const hasStudyfieldRole = async (roles, agreements) => {
    const studyfieldRoles = ['manager', 'resp_professor']
    const thesisProgramme = await getStudyfieldsProgramme(agreements[0].studyfieldId)
    const studyfieldRole = roles
        .filter(item => item.programme.programmeId === thesisProgramme.programmeId)
        .find(item => studyfieldRoles.includes(item.role.name))

    return !!studyfieldRole
}

const isManagerRespProfOrPrintPerson = async (roles, agreements) => {
    const studyfieldRoles = ['manager', 'resp_professor', 'print_person']
    const thesisProgramme = await getStudyfieldsProgramme(agreements[0].studyfieldId)
    const studyfieldRole = roles
        .filter(item => item.programme.programmeId === thesisProgramme.programmeId)
        .find(item => studyfieldRoles.includes(item.role.name))

    return !!studyfieldRole
}

const isAgreementPersonForThesis = async (user, agreements) => {
    const agreementPersons = await Promise.map(
        agreements,
        agreement => getAgreementPersonsByAgreementId(agreement.agreementId)
    ).reduce((prev, cur) => prev.concat(cur), [])

    return !!agreementPersons.find(person => person.personId === user.personId)
}

const isAuthor = (user, agreements) => {
    if (agreements.length < 1) {
        return false
    }
    return !agreements.some(agreement => agreement.authorId !== user.personId)
}
