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
            if (err) {
                if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
                    console.log(`development mode, ignoring error with token ${JSON.stringify(err)}`)
                    next()
                } else {
                    res.status(403).json({ message: `JWT verify led to error ${JSON.stringify(err)}` })
                }
            } else if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test' ||
                decoded.userId === req.headers.uid) {
                req.decodedToken = decoded
                next()
            } else {
                res.status(403)
                    .json({ message: `token userId ${decoded.userId} was not equal to headers uid ${req.headers.uid}` })
                    .end()
            }
        })
    } else {
        res.status(403).json({ message: 'No token in headers' }).end()
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
