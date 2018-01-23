const personService = require('../services/PersonService');
const roleService = require('../services/RoleService');

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
        const shibUid = req.headers['uid'];
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

    console.log("shibRegister starts")
    if (!req.session.user_id) {
        console.log("First if")
        if (req.headers['shib-session-id'] && req.session.shib_session_id !== req.headers['shib-session-id']) {
            req.session.shib_session_id = req.headers['shib-session-id'];
            const shibUid = req.headers['uid'];
            const studentNumberRegex = /.*:([0-9]*)$/;
            const regexResults = studentNumberRegex.exec(req.headers['unique-code'])
            const studentNumber = regexResults ? regexResults[1] : undefined;
            try {
                const user = await personService.getPersonByShibbolethId(shibUid);
                req.session.user_id = user.personId;
                user.firstname = req.headers['givenname'];
                user.lastname = req.headers['sn'];
                user.email = req.headers['mail'];
                try {
                    console.log('update Person', user);
                    await personService.updatePerson(user);
                } catch (error) {
                    console.log("Updating person failed", error)
                }
            } catch (error) {
                const user = {
                    firstname: req.headers['givenname'],
                    lastname: req.headers['sn'],
                    studentNumber,
                    shibbolethId: req.headers['uid'],
                    email: req.headers['mail']
                    // updated_at: Date.now()
                };

                try {
                    console.log('save Person', user);
                    await personService.savePerson(user);
                } catch (error) {
                    console.log("Saving person failed", error);
                }
            }
        } else {
            console.log("Already has a session");
        }

    } else {
        console.log('session.user_id exists: ', req.session.user_id);
    }
    next();
};
