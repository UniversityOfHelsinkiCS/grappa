import Promise from 'bluebird'

import { getLoggedPerson } from './PersonService'
import { getStudyfieldsProgramme } from './ProgrammeService'
import { getAgreementPersonsByAgreementId, getUsersRoles, isUserAdminOrManager, doesUserHaveRole } from './RoleService'

export const checkUserHasRightToAddAgreement = async (req, studyfieldId) => {
    const user = await getLoggedPerson(req)
    const roles = await getUsersRoles(user)
    const checks = [isAdmin(roles), await hasStudyfieldRoleToAddThesis(roles, studyfieldId)]

    await checkPermissions(checks)
}

export const checkUserHasRightToModifyAgreement = async (req, agreements) => {
    const user = await getLoggedPerson(req)
    const roles = await getUsersRoles(user)
    const studyfieldId = agreements[0].studyfieldId
    const checks = [
        isAdmin(roles),
        await hasStudyfieldRole(roles, studyfieldId),
        isAgreementPersonForThesis(user, agreements)
    ]

    await checkPermissions(checks)
}

export const checkUserHasRightToSeeAgreement = async (req, agreements) => {
    const user = await getLoggedPerson(req)
    const roles = await getUsersRoles(user)
    const checks = [
        isAdmin(roles),
        await isManagerRespProfOrPrintPerson(roles, agreements),
        await isAgreementPersonForThesis(user, agreements),
        isAuthor(user, agreements)
    ]

    await checkPermissions(checks)
}

export const checkUserIsAdminOrManager = async (req) => {
    if (!await isUserAdminOrManager(await getLoggedPerson(req))) {
        throw new Error('User is not admin or manager')
    }
}

export const checkUserHasRightToPrint = async (req) => {
    const user = await getLoggedPerson(req)
    const printerRoles = ['manager', 'admin', 'print_person', 'resp_prof', 'admin']

    if (await doesUserHaveRole(user, printerRoles)) {
        return true
    }
    return false
}

const checkPermissions = async (checks) => {
    if (checks.includes(true)) {
        return
    }

    throw new Error('User has no access to do this action')
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

const hasStudyfieldRole = async (roles, studyfieldId) => {
    const studyfieldRoles = ['manager', 'resp_professor']
    const thesisProgramme = await getStudyfieldsProgramme(studyfieldId)
    const studyfieldRole = roles
        .filter(item => item.programme.programmeId === thesisProgramme.programmeId)
        .find(item => studyfieldRoles.includes(item.role.name))

    return !!studyfieldRole
}

const isManagerRespProfOrPrintPerson = async (roles, agreements) => {
    const studyfieldRoles = ['manager', 'resp_professor', 'print_person']
    const thesisProgramme = await getStudyfieldsProgramme(agreements[0].studyfieldId)
    const studyfieldRole = await roles
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
