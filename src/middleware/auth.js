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
                    console.log('development mode')
                    next()
                } else {
                    res.status(403).json({ message: `JWT verify led to error ${JSON.stringify(err)}` })
                }
            } else if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
                console.log('development mode')
                req.decodedToken = decoded
                next()
            } else if (decoded.userId === req.headers.uid) {
                console.log('decoded userId was equal to req.headers.uid')
                req.decodedToken = decoded
                next()
            } else {
                res.status(403)
                    .json({ message: `token userId ${JSON.stringify(decoded.userId)} was not equal to headers uid ${JSON.stringify(req.headers.uid)}` })
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
