const thesisService = require('../services/ThesisService');
const agreementService = require('../services/AgreementService');
const attachmentService = require('../services/AttachmentService');
const personService = require('../services/PersonService');

export async function getAllTheses(req, res) {
    const theses = await thesisService.getAllTheses();
    res.status(200).json(theses);
}

export async function getThesisById(req, res) {
    const thesis = await thesisService.getThesisById(req.params.id);
    res.status(200).json(thesis);
}

export async function saveThesisForm(req, res) {
    const data = req.body;
    try {
        // Order so that agreementId is available to save attachments.
        // Attachmentservice gives back the parsed multipart formdata
        let agreement = await agreementService.createFakeAgreement();
        const attachmentObject = await attachmentService.saveAttachments(req, res, agreement.agreementId);
        const attachments = attachmentObject.attachments;
        let thesis = attachmentObject.json;
        let person = {
            email: thesis.authorEmail,
            firstname: thesis.authorLastname,
            lastname: thesis.authorFirstname
        }
        person = await personService.savePerson(person)
        thesis.userId = person.personId;
        delete thesis.authorFirstname
        delete thesis.authorLastname
        delete thesis.authorEmail

        agreement.studyfieldId = thesis.studyfieldId;
        delete thesis.studyfieldId;

        if (thesis.graders) {
            thesis.graders.forEach(grader => {
                console.log(grader)
            })
            delete thesis.graders
        }

        delete thesis.thesisEmails

        console.log(thesis);
        const savedThesis = await thesisService.saveThesis(thesis);
        // Agreement was missing the thesisId completing linking.
        agreement.thesisId = savedThesis.thesisId;
        agreement = await agreementService.updateAgreement(agreement)

        res.status(200).json(savedThesis);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}