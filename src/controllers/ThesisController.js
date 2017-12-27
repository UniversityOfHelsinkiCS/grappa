const thesisService = require('../services/ThesisService');
const agreementService = require('../services/AgreementService');
const attachmentService = require('../services/AttachmentService');
const personService = require('../services/PersonService');
const roleService = require('../services/RoleService');
const studyfieldService = require('../services/StudyfieldService');
const notificationService = require('../services/NotificationService');

export async function getTheses(req, res) {
    try {
        const user = await personService.getLoggedPerson(req);
        let theses = []
        let newTheses = []

        const rolesInStudyfields = await getUsersRoles(user);
        if (rolesInStudyfields.find(item => item.role.name === 'admin')) {
            // As an admin, get all theses
            const allTheses = await thesisService.getAllTheses();
            res.status(200).json(allTheses).end();
            return;
        }

        // Get theses in studyfield where user is ...
        rolesInStudyfields.forEach(async item => {
            if (item.role.name === 'resp_professor' || item.role.name === 'print-person' || item.role.name === 'manager') {
                // ... As resp_professor, manager or print-person theses in studyfield
                newTheses = await thesisService.getThesesByStudyfield(item.studyfield.studyfieldId);
                theses = [...new Set([...theses, ...newTheses])];
            }
        })

        // Get theses where user is agreementperson
        newTheses = await thesisService.getThesesByAgreementPerson(user.personId)
        theses = [...new Set([...theses, ...newTheses])];

        // Get theses where user is author
        newTheses = await thesisService.getThesesByPersonId(user.personId)
        theses = [...new Set([...theses, ...newTheses])];

        res.status(200).json(theses).end();
    } catch (error) {
        res.status(500).json(error).end();
    }
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
        agreement.authorId = savedPerson.personId;
        delete thesis.authorFirstname
        delete thesis.authorLastname
        delete thesis.authorEmail

        agreement.studyfieldId = thesis.studyfieldId;
        delete thesis.studyfieldId;
        let savedGraders = []
        if (thesis.graders) {
            thesis.graders.forEach(async grader => {
                const personRole = await roleService.getPersonRole(grader.personId, agreement.studyfieldId, 'grader')
                if (personRole) {
                    //If person exists as a grader, link them
                    const agreementPerson = {
                        agreementId: agreement.agreementId,
                        personRoleId: personRole.personRoleId,
                    }
                    
                    roleService.saveAgreementPerson(agreementPerson)
                } else {
                    //Else make the person a grader.
                    const roleId = await roleService.getRoleId('grader');
                    
                    let personWithRole = {
                        personId: grader.personId,
                        studyfieldId: agreement.studyfieldId,
                        roleId
                    }
                    personWithRole = await roleService.savePersonRole(personWithRole);
                    const agreementPerson = {
                        agreementId: agreement.agreementId,
                        personRoleId: personWithRole.personRoleId,
                    }                    
                    roleService.saveAgreementPerson(agreementPerson)
                }
            })
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
            attachments: attachments,
        }

        notificationService.createNotification('THESIS_SAVE_ONE_SUCCESS', req);
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const getUsersRoles = async (user) => {
    const roleToId = await roleService.getRoles();
    const studyfieldToId = await studyfieldService.getAllStudyfields();
    const personRoles = await roleService.getPersonRoles(user.personId);
    return personRoles.map(role => {
        return {
            studyfield: studyfieldToId.find(studyfieldIdPair => studyfieldIdPair.studyfieldId === role.studyfieldId),
            role: roleToId.find(roleIdPair => roleIdPair.roleId === role.roleId)
        }
    })
}