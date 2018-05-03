const router = require('express').Router()
const personService = require('../services/PersonService')
const roleService = require('../services/RoleService')
const programmeService = require('../services/ProgrammeService')

const getPerson = async (uid) => {
    const user = await personService.getPersonByShibbolethId(uid)

    const roleToId = await roleService.getRoles()
    const programmeToId = await programmeService.getAllProgrammes()
    const personRoles = await roleService.getPersonRoles(user.personId)
    const roleHash = {}
    user.roles = personRoles.map((role) => {
        const programme = programmeToId.find(programmeIdPair => programmeIdPair.programmeId === role.programmeId)
        return {
            programme: programme.name,
            programmeId: programme.programmeId,
            role: roleToId.find(roleIdPair => roleIdPair.roleId === role.roleId).name
        }
    }).filter((role) => {
        const included = roleHash[`${role.programmeId}-${role.role}`]

        if (included)
            return false

        roleHash[`${role.programmeId}-${role.role}`] = true
        return true
    })

    return user
}

router.get('/', async (req, res) => {
    const user = await getPerson(req.headers.uid)
    user.affiliation = req.headers.edupersonaffiliation.split(';')
    res.status(200).json(user)
})


module.exports = router
