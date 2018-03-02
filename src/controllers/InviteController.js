const emailInviteService = require('../services/EmailInviteService')
const personService = require('../services/PersonService')
const agreementService = require('../services/AgreementService')
const roleService = require('../services/RoleService')

export async function thesisAuthorInvite(req, res) {
    const inviteData = await emailInviteService.getEmailInviteDataForToken(req.params.token)

    if (!inviteData) {
        res.status(404).end()
        return
    }

    const person = await personService.getLoggedPerson(req)
    await agreementService.linkAuthorToAgreement(inviteData.agreement, person.personId)
    await emailInviteService.markTokenUsed(req.params.token)

    if (inviteData.email !== person.email) {
        person.secondaryEmail = inviteData.email
        await personService.updatePerson(person)
    }

    res.status(200).end()
}

export async function roleInvite(req, res) {
    const inviteData = await emailInviteService.getEmailInviteDataForToken(req.params.token)

    if (!inviteData) {
        res.status(404).end()
        return
    }

    const person = await personService.getLoggedPerson(req)
    const personWithRole = {
        roleId: inviteData.role,
        personId: person.personId,
        programmeId: inviteData.programme
    }

    await roleService.savePersonRole(personWithRole)
    await emailInviteService.markTokenUsed(req.params.token)

    res.status(200).end()
}
