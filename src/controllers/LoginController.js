import logger from '../util/logger'

const personService = require('../services/PersonService')
const roleService = require('../services/RoleService')
const programmeService = require('../services/ProgrammeService')

const utf8 = require('utf8')
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

    res.status(200).send({ logoutUrl: `${logoutUrl}?return=https://grappa.cs.helsinki.fi/v2/` }).end()
}


// Return user
export async function login(req, res) {
    if (req.headers['shib-session-id']) {
        try {
            const { shibbolethId, studentNumber, firstname, lastname, email } =
                parseShibbolethInformationFromHeaders(req.headers)

            let user = await register(shibbolethId, studentNumber, firstname, lastname, email)

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
    user.token = await generateToken(user.shibbolethId)
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

const register = async (shibbolethId, studentNumber, firstname, lastname, email) => {
    try {
        const user = await personService.getPersonByShibbolethId(shibbolethId)
        user.firstname = firstname
        user.lastname = lastname
        user.email = email
        return personService.updatePerson(user)
    } catch (error) {
        const user = {
            firstname,
            lastname,
            studentNumber,
            shibbolethId,
            email
        }
        return personService.savePerson(user)
    }
}

// req.headers['shib-session-id'] = 'asdf';
// req.headers['unique-code'] = 'urn:schac:personalUniqueCode:int:studentID:helsinki.fi:123456789';
// req.headers['sn'] = 'Opiskelija';
// req.headers['givenname'] = 'Olli O';
// req.headers['displayname'] = 'Olli';
// req.headers['uid'] = 'oopiskelija';
// req.headers['mail'] = 'opiskelija@example.com';
// req.headers['edupersonaffiliation'] = 'student;member';
// req.headers['shib_logout_url'] = 'https://example.com/logout/';
const parseShibbolethInformationFromHeaders = (headers) => {
    const studentNumberRegex = /.*:([0-9]*)$/
    const regexResults = studentNumberRegex.exec(headers['unique-code'])
    const studentNumber = regexResults ? regexResults[1] : undefined

    const {
        uid: shibbolethId,
        givenname,
        sn,
        mail: email
    } = headers

    return {
        studentNumber,
        shibbolethId,
        firstname: utf8.decode(givenname),
        lastname: utf8.decode(sn),
        email
    }
}