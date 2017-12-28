const roleService = require('../services/RoleService');

export async function saveRole(req, res) {
    const data = req.body;

    try {
        const roleId = await roleService.getRoleId(data.name);
        const personWithRole = {
            roleId,
            personId: data.personId,
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
    const data = req.body;

    try {
        await roleService.updateVisitorRoleStudyfield(data.personId, data.studyfieldId);
        res.status(200).end();
    } catch (e) {
        res.status(500).end();
    }
}

export async function deleteRole(req, res) {
    res.status(500).end();
}
