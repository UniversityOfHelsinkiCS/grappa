const emailInviteService = require('../services/EmailInviteService');
const personService = require('../services/PersonService');
const agreementService = require('../services/AgreementService');

export async function thesisAuthorInvite(req, res) {
    try {
        const inviteData = await emailInviteService.getEmailInviteDataForToken(req.params.token);

        if (!inviteData) {
            res.status(404).end();
            return;
        }

        const person = await personService.getLoggedPerson(req);
        await agreementService.linkAuthorToAgreement(inviteData.agreement, person.personId);
        await emailInviteService.markTokenUsed(req.params.token);
        res.status(200).end();
    } catch (err) {
        console.error(err);
        res.status(500).end();
    }
}
