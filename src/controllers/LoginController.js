import logger from '../util/logger'

const personService = require('../services/PersonService')
const roleService = require('../services/RoleService')
const programmeService = require('../services/ProgrammeService')

const jwt = require('jsonwebtoken')
const config = require('../util/config')

const generateToken = async (uid) => {
    const user = await personService.getPersonByShibbolethId(uid)
    if (user) {
        const payload = { userId: uid }
        const token = jwt.sign(payload, config.TOKEN_SECRET, {
            expiresIn: '24h'
        })
        return token
    }
    return null
}


export async function logout(req, res) {
    const logoutUrl = req.headers.shib_logout_url

    req.session.destroy((error) => {
        if (error)
            logger.error('Logout error', { error })
    })

    res.status(200).send({ logoutUrl: `${logoutUrl}/?return=https://grappa.cs.helsinki.fi/v2/` }).end()
}


// Return user
export async function login(req, res) {
    try {
        const shibbolethId = req.headers.uid
        let user = await personService.getPersonByShibbolethId(shibbolethId)

        user = await buildPerson(user)

        res.status(200).json(user)
    } catch (err) {
        res.status(500).end()
    }
}

// Used without shibboleth
export async function fakeLogin(req, res) {
    const shibbolethId = req.params.id
    logger.debug(`Faking login with ${shibbolethId}`)
    try {
        let user = await personService.getPersonByShibbolethId(shibbolethId)

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
    user.token = generateToken(user.shibbolethId)
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
