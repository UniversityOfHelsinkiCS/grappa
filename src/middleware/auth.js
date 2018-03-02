const jwt = require('jsonwebtoken')

const personService = require('../services/PersonService')
const roleService = require('../services/RoleService')
const config = require('../util/config')

/**
 * Authentication middleware that is called before any requests.
 *
 */
module.exports.checkAuth = async (req, res, next) => {
    const token = req.headers['x-access-token']
    if (token) {
        jwt.verify(token, config.TOKEN_SECRET, (err, decoded) => {
            if (!err && // If no error
                (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test' || // environment is okay,
                    decoded.userId === req.headers.uid)) { // or userId is in headers
                req.decodedToken = decoded // everything is good, save to request for use in other routes
                next()
            } else {
                res.status(403).json({ message: 'Failed to authenticate token.' }).end()
            }
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
