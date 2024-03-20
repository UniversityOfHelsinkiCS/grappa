const jwt = require('jsonwebtoken')

const personService = require('../services/PersonService')
const roleService = require('../services/RoleService')
const config = require('../util/config')

const isShibboUser = (userId, uidHeader) => userId === uidHeader

const hasAtLeastOneRole = (userRoles, allowedRoleNames) =>
    userRoles.filter(item => allowedRoleNames.includes(item.role.name)).length > 0

/**
 * Authentication middleware that is called before any requests.
 *
 */
export const checkAuth = async (req, res, next) => {
    const token = req.headers['x-access-token']
    const { uid } = req.headers
    if (token) {
        jwt.verify(token, config.TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                res.status(403).json(err)
            } else if (isShibboUser(decoded.userId, uid)) {
                req.decodedToken = decoded

                if (req.headers['x-mock-user-id']) {
                    // only allow admins to mock other users
                    const user = await personService.getLoggedPerson(req)
                    const userRoles = await roleService.getUsersRoles(user)
                    const isAdmin = hasAtLeastOneRole(userRoles, ['admin'])

                    if (isAdmin || process.env.NODE === 'development') {
                        req.headers.uid = req.headers['x-mock-user-id']
                        req.isMockUser = true
                        // if x-mock-user-id is set, we need to mock userId also in the token
                        req.decodedToken.userId = req.headers['x-mock-user-id']
                    }
                }

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
    console.log("Checking admin")
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

export const checkPrintPersonManagerOrAdmin = async (req, res, next) => {
    const staffRoles = ['admin', 'manager', 'print_person']
    await checkRoles(staffRoles, req, res, next)
}

export const checkCanSubmitThesis = async (req, res, next) => {
    const staffRoles = ['manager', 'resp_professor', 'supervisor', 'grader', 'admin']
    await checkRoles(staffRoles, req, res, next)
}

const checkRoles = async (allowedRoleNames, req, res, next) => {
    console.log("Checking roles")
    const user = await personService.getLoggedPerson(req)
    const userRoles = await roleService.getUsersRoles(user)
    try {
        if (hasAtLeastOneRole(userRoles, allowedRoleNames)) {
            console.log("Roles were ok")
            next()
        } else {
            res.status(403).json({ error: 'no access' })
        }
    } catch (err) {
        res.status(520).json({ error: 'something went wrong' })
    }
}
