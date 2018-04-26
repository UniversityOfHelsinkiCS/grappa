const jwt = require('jsonwebtoken')

const personService = require('../services/PersonService')
const roleService = require('../services/RoleService')
const config = require('../util/config')

const isShibboUser = (userId, uidHeader) => userId === uidHeader

/**
 * Authentication middleware that is called before any requests.
 *
 */
module.exports.checkAuth = async (req, res, next) => {
    const token = req.headers['x-access-token']
    const { uid } = req.headers
    if (token) {
        jwt.verify(token, config.TOKEN_SECRET, (err, decoded) => {
            if (err) {
                res.status(403).json(err)
            } else if (isShibboUser(decoded.userId, uid)) {
                req.decodedToken = decoded
                next()
            } else {
                res.status(403).json({ error: 'User shibboleth id and token id did not match' })
            }
        })
    } else {
        res.status(403).json({ error: 'No token in headers' })
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
