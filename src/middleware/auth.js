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
    const staffRoles = ['admin']
    await checkRoles(staffRoles, req, res, next)
}

export const checkStaff = async (req, res, next) => {
    const staffRoles = ['manager', 'resp_professor', 'supervisor', 'grader', 'admin', 'print_person']
    await checkRoles(staffRoles, req, res, next)
}

export const checkManagerOrAdmin = async (req, res, next) => {
    const staffRoles = ['admin', 'manager']
    await checkRoles(staffRoles, req, res, next)
}

export const checkCanSubmitThesis = async (req, res, next) => {
    const staffRoles = ['manager', 'resp_professor', 'supervisor', 'grader', 'admin']
    await checkRoles(staffRoles, req, res, next)
}

const checkRoles = async (allowedRoles, req, res, next) => {
    const user = await personService.getLoggedPerson(req)
    const userRoles = await roleService.getUsersRoles(user)
    try {
        if (userRoles.filter(item => allowedRoles.includes(item.role.name)).length > 0) {
            next()
        } else {
            res.status(403).json({ error: 'no access' })
        }
    } catch (err) {
        res.status(520).json({ error: 'something went wrong' })
    }
}
