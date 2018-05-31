const jwt = require('jsonwebtoken')

const personService = require('../services/PersonService')
const roleService = require('../services/RoleService')
const config = require('../util/config')

const isShibboUser = (userId, uidHeader) => userId === uidHeader

/**
 * Authentication middleware that is called before any requests.
 *
 */
export const checkAuth = async (req, res, next) => {
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

export const checkAdmin = async (req, res, next) => {
    const user = await personService.getLoggedPerson(req)
    try {
        const roles = await roleService.getUsersRoles(user)
        if (roles.filter(role => role.role.name === 'admin').length > 0) {
            next()
        } else {
            res.status(403).json({ error: 'denied' })
        }
    } catch (err) {
        res.status(520).json({ error: 'something went wrong' })
    }
}

export const checkStaff = async (req, res, next) => {
    const user = await personService.getLoggedPerson(req)
    const staffRoles = ['manager', 'resp_professor', 'supervisor', 'grader', 'admin', 'print_person']
    const userRoles = await roleService.getUsersRoles(user)
    try {
        if (userRoles.filter(item => staffRoles.includes(item.role.name)).length > 0) {
            next()
        } else {
            res.status(403).json({ error: 'denied' })
        }
    } catch (err) {
        res.status(520).json({ error: 'something went wrong' })
    }
}

export const checkManagerOrAdmin = async (req, res, next) => {
    const user = await personService.getLoggedPerson(req)
    try {
        const roles = await roleService.getUsersRoles(user)

        if (roles.filter(role => (role.role.name === 'manager'
            || role.role.name === 'admin')
        ).length > 0) {
            next()
        } else {
            res.status(403).json({ error: 'denied' })
        }
    } catch (err) {
        res.status(520).json({ error: 'something went wrong' })
    }
}

export const checkCanSubmitThesis = async (req, res, next) => {
    const user = await personService.getLoggedPerson(req)
    const staffRoles = ['manager', 'resp_professor', 'supervisor', 'grader', 'admin']
    const userRoles = await roleService.getUsersRoles(user)
    try {
        if (userRoles.filter(item => staffRoles.includes(item.role.name)).length > 0) {
            next()
        } else {
            res.status(403).json({ error: 'denied' })
        }
    } catch (err) {
        res.status(520).json({ error: 'something went wrong' })
    }
}
