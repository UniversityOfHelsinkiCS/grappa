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
            firstname: thesis.authorFirstname,
            lastname: thesis.authorLastname
        }
        const savedPerson = await personService.savePerson(person)
        thesis.userId = savedPerson.personId;
        delete thesis.authorFirstname
        delete thesis.authorLastname
        delete thesis.authorEmail

        agreement.studyfieldId = thesis.studyfieldId;
        delete thesis.studyfieldId;
        let savedGraders = []
        if (thesis.graders) {
            //TODO: Handle creating new links between persons and agreement
            /*
            savedGraders = thesis.graders.map(grader => {
                //Return personroleservice.linkGraders
                return grader
            })*/
            delete thesis.graders
        }

        //TODO: Email system
        delete thesis.thesisEmails

        const savedThesis = await thesisService.saveThesis(thesis);
        // Agreement was missing the thesisId completing linking.
        agreement.thesisId = savedThesis.thesisId;
        const savedAgreement = await agreementService.updateAgreement(agreement)

        const response = {
            thesis: savedThesis,
            author: savedPerson,
            agreement: savedAgreement,
        }
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}