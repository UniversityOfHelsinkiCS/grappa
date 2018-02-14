import logger from '../util/logger'
import { checkUserIsAdminOrManager } from '../services/RoleService'

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
    const user = await personService.getLoggedPerson(req)

    if (!user) {
        return userNotFound(res)
    }
    const rolesInProgrammes = await roleService.getUsersRoles(user)

    // Add user to person list
    persons.push(user)

    // If user is an admin, get everything
    if (rolesInProgrammes.find(item => item.role.name === 'admin')) {
        return getAllPersons(res)
    }

    rolesInProgrammes.forEach(async (item) => {
        // As resp_prof persons who are writing theses in programme
        if (programmeRoles.includes(item.role.name)) {
            newPersons = await personService.getPersonsWithAgreementInStudyfield(item.programme.programmeId)
            persons = [...new Set([...persons, ...newPersons])]
        }
    })
    // Persons who are supervisors / supervising for new thesis / agreement supervisor list
    const supervisorId = await roleService.getRoleId('supervisor')
    newPersons = await personService.getPersonsWithRole(supervisorId)
    persons = [...new Set([...persons, ...newPersons])]
    // or grading / graders for new thesis / agreement graders list.
    const graderId = await roleService.getRoleId('grader')
    newPersons = await personService.getPersonsWithRole(graderId)
    persons = [...new Set([...persons, ...newPersons])]

    // Persons (students) who are writing theses user has access to as
    // a agreementperson (supervisor, grader etc)
    newPersons = await personService.getPersonsWithAgreementPerson(user.personId)
    persons = [...new Set([...persons, ...newPersons])]

    // Remove duplicates
    const responsePersons = []
    persons.forEach((person) => {
        if (!responsePersons.find(item => item.personId === person.personId)) {
            responsePersons.push(person)
        }
    })

    // All required persons found, now role objects for front
    const roles = await roleService.getRolesForAllPersons()
    const responseObject = {
        roles,
        persons: responsePersons
    }
    return res.status(200).json(responseObject)
}

async function userNotFound(res) {
    if (process.env.NODE_ENV !== 'development') {
        return res.status(200).json({}).end()
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
