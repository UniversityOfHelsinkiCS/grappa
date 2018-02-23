import logger from '../util/logger'

const personService = require('../services/PersonService')
const roleService = require('../services/RoleService')
const programmeService = require('../services/ProgrammeService')

export async function logout(req, res) {
    const logoutUrl = req.headers.shib_logout_url

    req.session.destroy((error) => {
        if (error)
            logger.error('Logout error', { error })

        res.status(200).send({ logoutUrl: `${logoutUrl}/return=https://grappa.cs.helsinki.fi/v2/` }).end()
    })
}


// Return user
export async function showUser(req, res) {
    if (req.session.user_id) {
        try {
            let user = await personService.getPersonById(req.session.user_id)

            user = await buildPerson(user)

            res.status(200).json(user)
        } catch (err) {
            res.status(500).end()
        }
    } else {
        res.status(401).end()
    }
}

// Used without shibboleth
export async function fakeLogin(req, res) {
    const shibbolethId = req.params.id
    logger.debug(`Faking login with ${shibbolethId}`)
    try {
        let user = await personService.getPersonByShibbolethId(shibbolethId)

        req.session.user_id = user.personId

        user = await buildPerson(user)

        res.status(200).json(user)
    } catch (err) {
        res.status(500).end()
    }
}

async function buildPerson(user) {
    const roleToId = await roleService.getRoles()
    const programmeToId = await programmeService.getAllProgrammes()
    const personRoles = await roleService.getPersonRoles(user.personId)
    const roleHash = {}

    user.roles = personRoles.map((role) => {
        const programme = programmeToId.find(programmeIdPair => programmeIdPair.programmeId === role.programmeId)
        return {
            programme: programme.name,
            programmeId: programme.programmeId,
            role: roleToId.find(roleIdPair => roleIdPair.roleId === role.roleId).name
        }
    }).filter((role) => {
        const included = roleHash[`${role.programmeId}-${role.role}`]

        if (included)
            return false

        roleHash[`${role.programmeId}-${role.role}`] = true
        return true
    })

    return user
}
