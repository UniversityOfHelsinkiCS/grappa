import logger from '../util/logger'
import { checkUserIsAdminOrManager } from '../services/RoleService'
import { getLoggedPerson, updatePerson } from '../services/PersonService'

const personService = require('../services/PersonService')
const roleService = require('../services/RoleService')
const emailInviteService = require('../services/EmailInviteService')

/**
 * Get persons that are of interest to the person doing query
 */
export async function getPersons(req, res) {
    // TODO test & refactor
    const programmeRoles = ['resp_professor', 'print_person', 'manager']

    let persons = []
    let newPersons = []
    const user = await getLoggedPerson(req)

    if (!user) {
        return userNotFound(res)
    }

    // Add user to person list
    persons.push(user)

    // If user is an admin, get everything
    if (await roleService.isUserAdmin(user)) {
        return getAllPersons(res)
    }

    const rolesInProgrammes = await roleService.getUsersRoles(user)

    rolesInProgrammes.forEach(async (item) => {
        if (programmeRoles.includes(item.role.name)) {
            newPersons = await personService.getPersonsWithAgreementInStudyfield(item.programme.programmeId)
            persons = [...new Set([...persons, ...newPersons])]
        }
        if (item.role.name === 'manager') {
            newPersons = await personService.getProgrammePersons(item.programme.programmeId)
            persons = [...new Set([...persons, ...newPersons])]
        }
    })

    const gradersAndSupervisors = await getGradersAndSupervisors()

    // Persons (students) who are writing theses user has access to as
    // a agreementperson (supervisor, grader etc)
    newPersons = await personService.getPersonsWithAgreementPerson(user.personId)
    persons = [...new Set([...persons, ...gradersAndSupervisors, ...newPersons])]

    // All required persons found, now role objects for front
    const roles = await roleService.getRolesForAllPersons()
    const responseObject = {
        roles,
        persons: removeDuplicates(persons)
    }
    return res.status(200).json(responseObject)
}

async function getGradersAndSupervisors() {
    const supervisorId = await roleService.getRoleId('supervisor')
    const graderId = await roleService.getRoleId('grader')

    const supervisors = await personService.getPersonsWithRole(supervisorId)
    const graders = await personService.getPersonsWithRole(graderId)
    return [...supervisors, ...graders]
}

function removeDuplicates(persons) {
    const responsePersons = new Map()
    persons.forEach((person) => {
        if (!responsePersons.get(person.personId)) {
            responsePersons.set(person.personId, person)
        }
    })

    return [...responsePersons.values()]
}

async function userNotFound(res) {
    if (process.env.NODE_ENV !== 'development') {
        return res.status(403).json({ message: `DecodedToken did not contain valid userId ${res.decodedToken}` }).end()
    }
    logger.debug('It indeed is a developer.')
    const persons = await personService.getAllPersons()
    const roles = await roleService.getRolesForAllPersons()
    const responseObject = {
        roles,
        persons
    }
    return res.status(200).json(responseObject).end()
}

async function getAllPersons(res) {
    const persons = await personService.getAllPersons()
    const roles = await roleService.getRolesForAllPersons()
    const responseObject = {
        roles,
        persons
    }
    return res.status(200).json(responseObject).end()
}

export async function invitePerson(req, res) {
    await checkUserIsAdminOrManager(req)
    await emailInviteService.createEmailInviteForRole(req.body)
    res.status(200).end()
}

export async function useSecondaryEmail(req, res) {
    const person = await getLoggedPerson(req)

    person.useSecondaryEmail = req.body.useSecondaryEmail
    await updatePerson(person)
    const updatedPerson = await personService.getPersonById(person.personId)

    res.status(200).json(updatedPerson).end()
}
