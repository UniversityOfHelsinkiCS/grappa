import logger from '../util/logger'
import { checkUserIsAdminOrManager } from '../services/RoleService'
import { getLoggedPerson, updatePerson } from '../services/PersonService'

const personService = require('../services/PersonService')
const roleService = require('../services/RoleService')
const programmeService = require('../services/ProgrammeService')
const emailInviteService = require('../services/EmailInviteService')
const emailService = require('../services/EmailService')

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

export const getManagers = async (req, res) => {
    const managers = await personService.getPersonsForRole('manager')
    return res.status(200).json({ managers })
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
    const managers = await personService.getPersonsForRole('manager')
    const persons = await personService.getAllPersons()
    const roles = await roleService.getRolesForAllPersons()
    const responseObject = {
        roles,
        persons,
        managers
    }
    return res.status(200).json(responseObject).end()
}

export async function invitePerson(req, res) {
    await checkUserIsAdminOrManager(req)
    const { programmes, role, email, firstname, lastname } = req.body
    const roleId = await roleService.getRoleId(role)
    const newPerson = await personService.createOutsidePerson(firstname, lastname, email, programmes, roleId)
    if (!newPerson.errorMsg) {
        const programmesWithNames = await programmeService.getProgrammesByIds(programmes)
        await emailService.sendAddedToGrappa(programmesWithNames.serialize(), role, email, firstname, lastname)
        res.status(201).send(newPerson)
    } else {
        res.status(400).send(newPerson)
    }
    res.status(200).end()
}

export async function useSecondaryEmail(req, res) {
    const person = await getLoggedPerson(req)

    person.useSecondaryEmail = req.body.useSecondaryEmail
    await updatePerson(person)
    const updatedPerson = await personService.getPersonById(person.personId)

    res.status(200).json(updatedPerson).end()
}

export const addOutsidePerson = async (req, res) => {
    await checkUserIsAdminOrManager(req)
    const { programmes, firstname, lastname, email } = req.body
    const outsidePerson = await personService.createOutsidePerson(firstname, lastname, email, programmes, 'grader')
    if (!outsidePerson.errorMsg) {
        res.status(201).send(outsidePerson)
    } else {
        res.status(400).send(outsidePerson)
    }
}

export const requestGrader = async (req, res) => {
    // TODO: check user has right to submit thesis
    const personData = req.body.person
    const { role } = req.body.roleRequest
    const programmeId = parseInt(req.body.roleRequest.programmeId, 10)
    const person = await personService.savePerson(personData)
    const { personId } = person
    const roleId = await roleService.getRoleId(role)
    // check that this person doesn't already have grader role in the programme
    if (await roleService.getPersonRole(personId, programmeId, role) === undefined) {
        await roleService.submitRoleRequest(personId, roleId, programmeId)
        const graders = await personService.getPersonsWithRoleForProgramme(roleId, programmeId)
        const pendingGraders = await personService.getPendingPersonsWithRole(roleId, programmeId)
        // Is there a simpler way to append these to queries?
        const allGraders = [...graders.serialize(), ...pendingGraders.serialize()]
        res.status(201).json(allGraders)
        return
    }
    res.status(400).json({ msg: 'not like this' })
}

export const getProgrammeGraders = async (req, res) => {
    const { programmeId } = req.query
    const roleId = await roleService.getRoleId('grader')
    const graders = await personService.getPersonsWithRoleForProgramme(roleId, programmeId)
    const pendingGraders = await personService.getPendingPersonsWithRole(roleId, programmeId)
    // Is there a simpler way to append these to queries?
    const allGraders = [...graders.serialize(), ...pendingGraders.serialize()]
    res.status(200).json(allGraders)
}
