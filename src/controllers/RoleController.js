import { checkUserIsAdminOrManager } from '../services/RoleService'

const roleService = require('../services/RoleService')
const personService = require('../services/PersonService')

export async function getAvailableRoles(req, res) {
    const roles = await roleService.getAvailableRoles()
    res.status(200).json(roles)
}

export async function saveRole(req, res) {
    if (req.body.roleId === 1) {
        throw new Error('Admin role creation is not allowed.')
    }

    const userRoles = await roleService.getUsersRoles(await personService.getLoggedPerson(req))

    if (!userRoles.find(item => item.role.name === 'admin' || item.role.name === 'manager')) {
        throw new Error('User has no access to edit roles')
    }

    let personWithRole = {
        roleId: req.body.roleId,
        personId: req.body.personId,
        programmeId: req.body.programmeId
    }
    personWithRole = await roleService.savePersonRole(personWithRole)
    const roles = await roleService.getRolesForPersonWithRole(personWithRole.personRoleId)
    const role = roles[0]
    res.status(200).json(role).end()
}

export async function deleteRole(req, res) {
    await checkUserIsAdminOrManager(req)
    let personRoleId = req.params.id
    personRoleId = await roleService.deletePersonRole(personRoleId)
    res.status(200).json(personRoleId).end()
}

export async function updateStatement(req, res) {
    const person = await personService.getLoggedPerson(req)
    const { agreementId, personRoleId } = req.body
    const agreementPerson = {
        statement: req.body.statement,
        approved: req.body.approved,
        approverId: person.personId,
        approvalDate: new Date()
    }

    await roleService.updateAgreementPerson(agreementId, personRoleId, agreementPerson)
    const updatedRole = await roleService.getRoleWithAgreementIdAndPersonRole(agreementId, personRoleId)
    res.status(200).json(updatedRole).end()
}

export const sendGraderRequest = async (req, res) => {
    const programmeId = parseInt(req.body.programmeId)
    const user = await personService.getLoggedPerson(req)
    const roles = await roleService.getUsersRoles(user)
    if (roles.find(r => r.role.name === 'grader' && r.programme.programmeId === programmeId)) {
        res.status(409).json({ msg: 'You already have grader right for that unit.' })
        return
    }
    const roleId = await roleService.getRoleId('grader')
    const rr = await roleService.submitRoleRequest(user.personId, roleId, programmeId)
    console.log(rr)
    res.status(201).json({ msg: 'Good job, you!' })
}

export const getUnhandledRoleRequests = async (req, res) => {
    await checkUserIsAdminOrManager(req)
    const roleRequests = await roleService.findUnhandledRoleRequests()
    console.log(roleRequests)
    res.status(200).json(roleRequests)
}

export const handleRoleRequest = async (req, res) => {
    const { roleRequestId, granted } = req.body
    await checkUserIsAdminOrManager(req)
    const user = await personService.getLoggedPerson(req)
    await roleService.grantRoleRequest(roleRequestId, granted, user)
    const roleRequests = await roleService.findUnhandledRoleRequests()
    res.status(201).json(roleRequests)
}
