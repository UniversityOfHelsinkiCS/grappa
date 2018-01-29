const utf8 = require('utf8');
const personService = require('../services/PersonService');
const roleService = require('../services/RoleService');

const logger = require('../util/logger');

/**
 * Authentication middleware that is called before any requests.
 *
 */
module.exports.checkAuth = async (req, res, next) => {
    if (!req.session.user_id) {
        if (!req.headers['shib-session-id']) {
            // forbid if in production and bypassed shibboleth
            if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'development') {
                res.status(403).end();
            }
        }
        // log user in if shibboleth session id exists
        req.session.shib_session_id = req.headers['shib-session-id'];
        const shibUid = req.headers.uid;
        try {
            const user = await personService.getPersonByShibbolethId(shibUid);
            if (user) {
                req.session.user_id = user.personId;
            }
            next();
        } catch (err) {
            res.status(404).end();
        }
    } else {
        next();
    }
};

module.exports.checkAdmin = async (req, res, next) => {
    const user = await personService.getLoggedPerson(req);
    try {
        const roles = await roleService.getRoles(user.personId);

        if (roles.filter(role => role.name === 'admin').length > 0) {
            next();
        } else {
            res.status(404).end();
        }
    } catch (err) {
        res.status(404).end();
    }
};

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

    logger.debug('shibRegister starts');
    if (!req.session.user_id) {
        logger.debug('First if');
        if (req.headers['shib-session-id'] && req.session.shib_session_id !== req.headers['shib-session-id']) {
            req.session.shib_session_id = req.headers['shib-session-id'];
            const shibUid = req.headers.uid;
            const studentNumberRegex = /.*:([0-9]*)$/;
            const regexResults = studentNumberRegex.exec(req.headers['unique-code']);
            const studentNumber = regexResults ? regexResults[1] : undefined;
            try {
                const user = await personService.getPersonByShibbolethId(shibUid);
                req.session.user_id = user.personId;
                user.firstname = utf8.decode(req.headers.givenname);
                user.lastname = utf8.decode(req.headers.sn);
                user.email = req.headers.mail;
                try {
                    logger.debug('update Person', user);
                    await personService.updatePerson(user);
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
                };

                try {
                    logger.info('save Person', user);
                    const person = await personService.savePerson(user);
                    logger.debug('Done:', person);
                    req.session.user_id = person.personId;
                } catch (error2) {
                    logger.error('Saving person failed', error2);
                }
            }
            try {
                const user = await personService.getPersonByShibbolethId(shibUid);
                if (user) {
                    req.session.user_id = user.personId;
                }
            } catch (error) {
                logger.error('Help', error)
            }
        } else {
            logger.debug('Already has a session');
        }
    }
    logger.debug('session.user_id exists: ', req.session.user_id);
    next();
};
