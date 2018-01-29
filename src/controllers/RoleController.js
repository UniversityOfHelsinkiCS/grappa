const roleService = require('../services/RoleService');
const personService = require('../services/PersonService');

export async function getAvailableRoles(req, res) {
    const roles = await roleService.getRoles();
    res.status(200).json(roles);
}

export async function saveRole(req, res) {
    let personWithRole = {
        roleId: req.body.roleId,
        personId: req.body.personId,
        programmeId: req.body.programmeId
    };
    personWithRole = await roleService.savePersonRole(personWithRole);
    const roles = await roleService.getRolesForPersonWithRole(personWithRole.personRoleId);
    const role = roles[0];
    res.status(200).json(role).end();
}

export async function deleteRole(req, res) {
    let personRoleId = req.params.id;
    personRoleId = await roleService.deletePersonRole(personRoleId);
    res.status(200).json(personRoleId).end();
}

export async function updateStatement(req, res) {
    const person = await personService.getLoggedPerson(req);
    const { agreementId, personRoleId } = req.body;
    const agreementPerson = {
        statement: req.body.statement,
        approved: req.body.approved,
        approverId: person.personId,
        approvalDate: new Date()
    };

    await roleService.updateAgreementPerson(agreementId, personRoleId, agreementPerson);
    const updatedRole = await roleService.getRoleWithAgreementIdAndPersonRole(agreementId, personRoleId);
    res.status(200).json(updatedRole).end();
}

export async function updateVisitorRoles(req, res) {
    const person = await personService.getLoggedPerson(req);
    await roleService.updateVisitorRoleStudyfields(person.personId, req.body.programmeIds);
    res.status(200).end();
}
