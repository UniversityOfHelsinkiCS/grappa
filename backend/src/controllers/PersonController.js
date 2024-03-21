import logger from '../util/logger'
import { getLoggedPerson, updatePerson } from '../services/PersonService'

const personService = require('../services/PersonService')
const roleService = require('../services/RoleService')
const programmeService = require('../services/ProgrammeService')
const emailService = require('../services/EmailService')

export async function findPersons(req, res) {
    const { search } = req.query
    if (!search) {
        res.send(403, 'Search string must be provided as a query parameter')
    }
    if (search.trim().length < 5) {
        res.send(403, 'Search string must be at least 5 characters long')
    }

    const persons = await personService.searchPersons(search.trim())
    res.status(200).json(persons)
}

/**
 * Get persons
 */
export async function getPersons(req, res) {
    const user = await getLoggedPerson(req)

    if (!user) {
        return userNotFound(res)
    }

    const persons = await personService.getAllPersonsWithRoles()
    const responseObject = {
        persons
    }
    return res.status(200).json(responseObject)
}

export const getManagers = async (req, res) => {
    const managers = await personService.getPersonsForRole('manager')
    return res.status(200).json({ managers })
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


/**
 * Creates a new person with specified roles.
 * Email message is sent to invited person to inform about addition to grappa.
 * @param {*} req
 * @param {*} res
 */
export const invitePerson = async (req, res) => {
    // await checkUserIsAdminOrManager(req)
    const { programmes, role, email, firstname, lastname } = req.body
    const roleId = await roleService.getRoleId(role)
    const personId = await personService.createNewPerson(firstname, lastname, email, programmes, roleId)
    if (personId) {
        const programmesWithNames = await programmeService.getProgrammesByIds(programmes)
        await emailService.sendAddedToGrappa(programmesWithNames.serialize(), role, email, firstname, lastname)
        const person = await personService.getPersonWithRoles(personId)
        res.status(201).json({ person, msg: `Added ${person.firstname} ${person.lastname} to Grappa as ${role} in ${programmes}, invite message sent to ${person.email}.` })
    } else {
        res.status(400).json({ error: `Could not add ${firstname}, ${lastname} (${email}) as ${role} in ${programmes}, please check that all details are correct` })
    }
}

export async function useSecondaryEmail(req, res) {
    const person = await getLoggedPerson(req)

    person.useSecondaryEmail = req.body.useSecondaryEmail
    await updatePerson(person)
    const updatedPerson = await personService.getPersonById(person.personId)

    res.status(200).json(updatedPerson).end()
}

/**
 * Creates a new role request for the specified person.
 * Person is created if doesn't exist already and then a role request is created for them.
 * @param {} req
 * @param {} res
 */
export const requestGrader = async (req, res) => {
    const personData = {
        email: req.body.person.email.toLowerCase(),
        firstname: req.body.person.firstname,
        lastname: req.body.person.lastname
    }
    const { role } = req.body.roleRequest
    // programmeId comes as a string, so it needs to be parsed
    const programmeId = parseInt(req.body.roleRequest.programmeId, 10)
    const person = await personService.savePerson(personData)
    const { personId } = person
    const roleId = await roleService.getRoleId(role)
    // check that this person doesn't already have grader role in the programme
    if (await roleService.getPersonRole(personId, programmeId, role) === undefined) {
        await roleService.submitRoleRequest(personId, roleId, role, programmeId)
        const graders = await personService.getPersonsWithRoleForProgramme(roleId, programmeId)
        const pendingGraders = await personService.getPendingPersonsWithRole(roleId, programmeId)
        // Is there a simpler way to append these to queries?
        const allGraders = [...graders.serialize(), ...pendingGraders.serialize()]
        res.status(201).json({
            allGraders,
            msg: `Created request for ${person.firstname} ${person.lastname} (${person.email}) to be added as a ${role}`
        })
        return
    }
    res.status(400).json({
        error: `Could not create a request for ${person.firstname} ${person.lastname} (${person.email}) to be added as a ${role}`
    })
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
