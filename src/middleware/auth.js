const utf8 = require('utf8')
const jwt = require('jsonwebtoken')

const personService = require('../services/PersonService')
const roleService = require('../services/RoleService')
const config = require('../util/config')

const logger = require('../util/logger')

/**
 * Authentication middleware that is called before any requests.
 *
 */
module.exports.checkAuth = async (req, res, next) => {
    const token = req.headers['x-access-token']
    if (token) {
        jwt.verify(token, config.TOKEN_SECRET, (err, decoded) => {
            if (err) {
                res.status(403).json({ message: 'Failed to authenticate token.' }).end()
            }
            // if everything is good, save to request for use in other routes
            req.decodedToken = decoded
            next()
        })
    } else {
        res.status(403).end()
    }
}

module.exports.checkAdmin = async (req, res, next) => {
    const user = await personService.getLoggedPerson(req)
    try {
        const roles = await roleService.getRoles(user.personId)

        if (roles.filter(role => role.name === 'admin').length > 0) {
            next()
        } else {
            res.status(404).end()
        }
    } catch (err) {
        res.status(404).end()
    }
}

module.exports.shibRegister = async (req, res, next) => {
    // fake shibboleth headers for testing
    // req.headers['shib-session-id'] = 'asdf';
    // req.headers['unique-code'] = 'urn:schac:personalUniqueCode:int:studentID:helsinki.fi:123456789';
    // req.headers['sn'] = 'Opiskelija';
    // req.headers['givenname'] = 'Olli O';
    // req.headers['displayname'] = 'Olli';
    // req.headers['uid'] = 'oopiskelija';
    // req.headers['mail'] = 'opiskelija@example.com';
    // req.headers['edupersonaffiliation'] = 'student;member';
    // req.headers['shib_logout_url'] = 'https://example.com/logout/';
    const token = req.headers['x-access-token']

    logger.debug('shibRegister starts')
    if (!token) {
        logger.debug('First if')
        if (req.headers['shib-session-id']) {
            const shibUid = req.headers.uid
            const studentNumberRegex = /.*:([0-9]*)$/
            const regexResults = studentNumberRegex.exec(req.headers['unique-code'])
            const studentNumber = regexResults ? regexResults[1] : undefined
            try {
                const user = await personService.getPersonByShibbolethId(shibUid)
                user.firstname = utf8.decode(req.headers.givenname)
                user.lastname = utf8.decode(req.headers.sn)
                user.email = req.headers.mail
                try {
                    logger.debug('update Person', user)
                    await personService.updatePerson(user)
                } catch (error) {
                    logger.error('Updating person failed', error)
                }
            } catch (error) {
                const user = {
                    firstname: utf8.decode(req.headers.givenname),
                    lastname: utf8.decode(req.headers.sn),
                    studentNumber,
                    shibbolethId: req.headers.uid,
                    email: req.headers.mail
                }

                try {
                    logger.info('save Person', user)
                    const person = await personService.savePerson(user)
                    logger.debug('Done:', person)
                } catch (error2) {
                    logger.error('Saving person failed', error2)
                }
            }
        } else {
            logger.debug('Header didnt have shib-session-id')
            res.status(403).end()
        }
    }
    logger.debug('token already exists: ', token)
    next()
}
