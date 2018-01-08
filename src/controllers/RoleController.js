const roleService = require('../services/RoleService');
const personService = require('../services/PersonService');

export async function saveRole(req, res) {
    const data = req.body;
    const person = await personService.getLoggedPerson(req);

    try {
        const roleId = await roleService.getRoleId(data.name);
        const personWithRole = {
            roleId,
            personId: person.personId,
            studyfieldId: data.studyfieldId
        };
        await roleService.savePersonRole(personWithRole);
        res.status(200).end();
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
