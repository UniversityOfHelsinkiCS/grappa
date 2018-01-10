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
            studyfieldId: req.body.studyfieldId
        };
        personWithRole = await roleService.savePersonRole(personWithRole);
        const role = await roleService.getRoleForPersonWithRole(personWithRole.personRoleId)
        res.status(200).json(role).end();
    } catch (e) {
        console.log(e);
        res.status(500).end();
    }
}

export async function updateRole(req, res) {
    res.status(500).end();
}

export async function updateVisitorRoles(req, res) {
    const studyfieldIds = req.body.studyfieldIds;
    const person = await personService.getLoggedPerson(req);

    try {
        await roleService.updateVisitorRoleStudyfields(person.personId, studyfieldIds);
        res.status(200).end();
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
}

export async function deleteRole(req, res) {
    res.status(500).end();
}
