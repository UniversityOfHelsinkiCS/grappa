const personService = require('../services/PersonService');
const roleService = require('../services/RoleService');
const studyfieldService = require('../services/StudyfieldService');

export async function getGraders(req, res) {
    console.log("getGraders start");
    try {
        const roleId = await roleService.getRoleId("grader");
        const studyfield = await studyfieldService.getStudyfield(2);
        const studyfieldId = studyfield.studyfieldId;
        console.log(studyfield);
        console.log("StudyfieldId", studyfieldId)
        let persons = await personService.getPersonsWithRole(roleId)
        console.log("Persons 1",persons)
        persons = await personService.getPersonsWithRoleInStudyfield(roleId, studyfieldId);
        console.log("Persons 2",persons)
        res.status(200).json([]).end();
    } catch (err) {
        console.log(err);
        res.status(500).json(err).end()
    }
}

export async function saveGrader(req, res) {
    try {
        const grader = req.body;
        const newGrader = await graderService.saveGrader(grader);
    } catch (err) {
        res.status(500).json(err).end()
    }
}

export async function updateGrader(req, res) {
    try {
        const grader = req.body;
    } catch (err) {
        res.status(500).json(err).end()
    }
}

export async function deleteGrader(req, res) {
    try {
        const graderId = req.params.id;
    } catch (err) {
        res.status(500).json(err).end()
    }
}