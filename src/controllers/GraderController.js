const personService = require('../services/PersonService');
const roleService = require('../services/RoleService');

export async function getGraders(req, res) {
    try {
        // TODO: Filter them
        const roleId = await roleService.getRoleId("grader");
        const persons = await personService.getPersonsWithRole(roleId);
        //const persons = await personService.getPersonsWithRoleInStudyfield(roleId, studyfieldId);
        res.status(200).json(persons).end();
    } catch (err) {
        res.status(500).json(err).end();
    }
}

export async function saveGrader(req, res) {
    try {
        const grader = req.body;
        //Add role to a person
    } catch (err) {
        res.status(500).json(err).end()
    }
}

export async function updateGrader(req, res) {
    try {
        const grader = req.body;
        //
    } catch (err) {
        res.status(500).json(err).end()
    }
}

export async function deleteGrader(req, res) {
    try {
        const graderId = req.params.id;
        //Remove role from a person.
    } catch (err) {
        res.status(500).json(err).end()
    }
}