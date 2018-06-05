import logger from '../util/logger'

const personService = require('../services/PersonService')

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
        // console.log(token)
        return token
    }
    return null
}


export const logout = async (req, res) => {
    try {
        const logoutUrl = req.headers.shib_logout_url
        const { returnUrl } = req.body
        if (logoutUrl) {
            return res.status(200).send({ logoutUrl: `${logoutUrl}?return=${returnUrl}` })
        }
        return res.status(200).send({ logoutUrl: returnUrl })
    } catch (err) {
        return res.status(500).json({ message: 'Error with logout', err })
    }
}


// Return user
export const login = async (req, res) => {
    if (req.headers['shib-session-id']) {
        try {
            const { shibbolethId, studentNumber, firstname, lastname, email } =
                parseShibbolethInformationFromHeaders(req.headers)
            await register(shibbolethId, studentNumber, firstname, lastname, email)
            const token = await generateToken(shibbolethId)
            res.status(200).json({ token })
        } catch (err) {
            res.status(500).send(err)
        }
    } else {
        res.status(401).send('No shib sesison id')
    }
}

const register = async (shibbolethId, studentNumber, firstname, lastname, email) => {
    try {
        const user = await personService.getPersonByShibbolethId(shibbolethId)
        if (!user) {
            const nonRegUser = await personService.getPersonByEmail(email)
            if (nonRegUser) {
                const newUser = await personService.updateNonRegisteredPerson(nonRegUser, studentNumber, shibbolethId)
                return newUser
            }
        }
        user.firstname = firstname
        user.lastname = lastname
        user.email = email
        return personService.updatePerson(user)
    } catch (error) {
        try {
            const user = {
                firstname,
                lastname,
                studentNumber,
                shibbolethId,
                email
            }
            return personService.savePerson(user)
        } catch (err) {
            return Promise.reject()
        }
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
    let lastname
    let firstname
    try {
        lastname = utf8.decode(sn)
    } catch (e) {
        lastname = sn
    }
    try {
        firstname = utf8.decode(givenname)
    } catch (e) {
        firstname = givenname
    }
    return {
        studentNumber,
        shibbolethId,
        firstname,
        lastname,
        email
    }
}
