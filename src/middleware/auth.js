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
            if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'dev') {
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

    if (!req.session.user_id) {
        if (req.headers['shib-session-id'] && req.session.shib_session_id !== req.headers['shib-session-id']) {
            // console.log('unknown shib session');
            req.session.shib_session_id = req.headers['shib-session-id'];
            const shibUid = req.headers['uid'];
            const studentNumberRegex = /.*:([0-9]*)$/
            const studentNumber = studentNumberRegex.exec(req.headers['unique-code'])[1];
            let user = await personService.getPersonByShibbolethId(shibUid);
            
            if (user) {
                // console.log('existing user ', user);
                req.session.user_id = user.personId;
                // should also check if user data matches shibboleth headers and update db if needed
                // or just update always:
                user.firstname = req.headers['givenname'];
                user.lastname = req.headers['sn'];
                user.email = req.headers['mail'];
                // user.updated_at = Date.now();
                await personService.updatePerson(user);
            } else {
                // console.log('new user logged in');
                user = {
                    firstname: req.headers['givenname'],
                    lastname: req.headers['sn'],
                    studentNumber,
                    shibbolethId: req.headers['uid'],
                    email: req.headers['mail'],
                    // updated_at: Date.now()
                };
                await personService.savePerson(user);
            }
        }
    } else {
        // console.log('userid ', req.session.user_id);
    }
    next();
}