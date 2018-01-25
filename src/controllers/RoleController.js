const roleService = require('../services/RoleService');
const personService = require('../services/PersonService');

export async function getAvailableRoles(req, res) {
    try {
        const person = await personService.getLoggedPerson(req);
        const roles = await roleService.getRoles();
        res.status(200).json(roles);
    } catch (error) {
        console.log(error);
        res.status(500).end();
    }
}

export async function saveRole(req, res) {
    try {
        const person = await personService.getLoggedPerson(req);

        let personWithRole = {
            roleId: req.body.roleId,
            personId: req.body.personId,
            programmeId: req.body.programmeId
        };
        personWithRole = await roleService.savePersonRole(personWithRole);
        const roles = await roleService.getRolesForPersonWithRole(personWithRole.personRoleId)
        const role = roles[0]
        res.status(200).json(role).end();
    } catch (error) {
        console.log(error);
        res.status(500).end();
    }
}

export async function deleteRole(req, res) {
    try {
        const person = await personService.getLoggedPerson(req);
        let personRoleId = req.params.id;
        personRoleId = await roleService.deletePersonRole(personRoleId);
        res.status(200).json(personRoleId).end();
    } catch (error) {
        res.status(500).end();
    }
}

export async function updateStatement(req, res) {
    try {
        const person = await personService.getLoggedPerson(req);
        const agreementPerson = {
            statement: req.body.statement,
            approved: req.body.approved,
            approverId: person.personId,
            approvalDate: new Date(),
        }
        await roleService.updateAgreementPerson(req.body.agreementId, req.body.personRoleId, agreementPerson);
        const updatedRole = await roleService.getRoleWithAgreementIdAndPersonRole(req.body.agreementId, req.body.personRoleId);
        res.status(200).json(updatedRole).end();
    } catch (error) {
        console.log(error);
        res.status(500).end();
    }
}

export async function updateVisitorRoles(req, res) {
    const programmeIds = req.body.programmeIds;
    const person = await personService.getLoggedPerson(req);

    try {
        await roleService.updateVisitorRoleStudyfields(person.personId, programmeIds);
        res.status(200).end();
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
}
