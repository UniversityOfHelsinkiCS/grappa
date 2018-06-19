import { checkUserIsAdminOrManager } from '../services/PermissionService'

const roleService = require('../services/RoleService')
const programmeService = require('../services/ProgrammeService')
const personService = require('../services/PersonService')
const emailService = require('../services/EmailService')

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
    await checkUserIsAdminOrManager(req)
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
    const programmeId = parseInt(req.body.programmeId, 10)
    const user = await personService.getLoggedPerson(req)
    const roles = await roleService.getUsersRoles(user)
    if (roles.find(r => r.role.name === 'grader' && r.programme.programmeId === programmeId)) {
        res.status(409).json({ msg: 'You already have grader right for that unit.' })
        return
    }
    const roleId = await roleService.getRoleId('grader')
    await roleService.submitRoleRequest(user.personId, roleId, 'grader', programmeId)
    res.status(201).json({ msg: 'Good job, you!' })
}

export const getUnhandledRoleRequests = async (req, res) => {
    await checkUserIsAdminOrManager(req)
    const roleRequests = await roleService.findUnhandledRoleRequests()
    res.status(200).json(roleRequests)
}

export const handleRoleRequest = async (req, res) => {
    const { roleRequestId, granted } = req.body
    await checkUserIsAdminOrManager(req)
    const granter = await personService.getLoggedPerson(req)
    const roleRequest = await roleService.grantRoleRequest(roleRequestId, granted, granter).then(request =>
        request.serialize())
    const requester = await personService.getPersonById(roleRequest.personId)
    const role = await roleService.getRoleById(roleRequest.roleId)
    const programme = await programmeService.getProgrammeById(roleRequest.programmeId)
    await emailService.sendRoleRequestNotification(requester.email,
        role.get('name'), granted, `${granter.firstname} ${granter.lastname}`, programme.get('name'))
    const roleRequests = await roleService.findUnhandledRoleRequests()
    res.status(201).json(roleRequests)
}
