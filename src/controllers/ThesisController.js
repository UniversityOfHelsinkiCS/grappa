const thesisService = require('../services/ThesisService');
const agreementService = require('../services/AgreementService');
const attachmentService = require('../services/AttachmentService');
const personService = require('../services/PersonService');
const roleService = require('../services/RoleService');
const studyfieldService = require('../services/StudyfieldService');
const notificationService = require('../services/NotificationService');
const emailService = require('../services/EmailService');
const emailInviteService = require('../services/EmailInviteService');

export async function getTheses(req, res) {
    const studyfieldRoles = ['resp_professor', 'print-person', 'manager'];

    try {
        const user = await personService.getLoggedPerson(req);
        let theses = [];
        let newTheses = [];

        const rolesInStudyfields = await getUsersRoles(user);
        if (rolesInStudyfields.find(item => item.role.name === 'admin')) {
            // As an admin, get all theses
            const allTheses = await thesisService.getAllTheses();
            res.status(200).json(allTheses).end();
            return;
        }

        rolesInStudyfields.forEach(async item => {
            if (studyfieldRoles.includes(item.role.name)) {
                // ... As resp_professor, manager or print-person theses in studyfield
                newTheses = await thesisService.getThesesByStudyfield(item.studyfield.studyfieldId);
                theses = [...new Set([...theses, ...newTheses])];
            }
        });

        const thesesAsAgreementPerson = await thesisService.getThesesByAgreementPerson(user.personId);
        const thesesAsAuthor = await thesisService.getThesesByPersonId(user.personId);

        theses = [...theses, ...thesesAsAgreementPerson, ...thesesAsAuthor];

        // Remove duplicates
        let response = [];
        theses.forEach(thesis => {
            if (!response.find(item => item.thesisId === thesis.thesisId)) {
                response.push(thesis);
            }
        });

        res.status(200).json(response).end();
    } catch (error) {
        console.error(error);
        res.status(500).json(error).end();
    }
}

export async function getThesisById(req, res) {
    const thesis = await thesisService.getThesisById(req.params.id);
    res.status(200).json(thesis);
}

export async function saveThesisForm(req, res) {
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
        };
        const savedPerson = await personService.savePerson(person);
        const studyfield = thesis.studyfieldId;
        const authorEmail = thesis.authorEmail;
        const agreementId = agreement.agreementId;

        agreement.authorId = savedPerson.personId;
        delete thesis.authorFirstname;
        delete thesis.authorLastname;

        agreement.studyfieldId = thesis.studyfieldId;
        delete thesis.studyfieldId;

        if (thesis.graders) {
            updateGraders(thesis.graders, agreement);
            delete thesis.graders;
        }

        // TODO: Add email to new email send table
        delete thesis.thesisEmails;
        delete thesis.authorEmail;

        const savedThesis = await thesisService.saveThesis(thesis);

        // Agreement was missing the thesisId completing linking.
        agreement.thesisId = savedThesis.thesisId;
        const savedAgreement = await agreementService.updateAgreement(agreement);

        const roles = await roleService.getRolesForAllPersons();

        await emailService.newThesisAddedNotifyRespProf(studyfield);
        await emailInviteService.createEmailInviteForThesisAuthor(authorEmail, agreementId);

        const response = {
            thesis: savedThesis,
            author: savedPerson,
            agreement: savedAgreement,
            attachments: attachments,
            roles
        };

        notificationService.createNotification('THESIS_SAVE_ONE_SUCCESS', req, agreement.studyfieldId);
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
        };
    });
};

export async function updateThesis(req, res) {
    try {
        const updatedFields = req.body;
        let thesis = await thesisService.getThesisById(updatedFields.thesisId);
        Object.keys(thesis).forEach(key => {
            thesis[key] = updatedFields[key];
        });
        thesis = await thesisService.updateThesis(thesis);

        const graders = updatedFields.graders;
        const agreements = await agreementService.getAgreementsByThesisId(thesis.thesisId);
        // TODO: support multiple agreements on one thesis
        await updateGraders(graders, agreements[0]);

        const roles = await roleService.getRolesForAllPersons();
        const responseObject = { thesis, roles };
        res.status(200).json(responseObject).end();
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const updateGraders = async (graders, agreement) => {
    // To unlink person and
    const agreementPersons = await roleService.getAgreementPersonsByAgreementId(agreement.agreementId);

    await Promise.all(agreementPersons.map(async agreementPerson => {
        const personRole = await roleService.getPersonRoleWithId(agreementPerson.personRoleId);
        if (!graders.find(grader => grader.personId == personRole.personId)) {
            await roleService.unlinkAgreementAndPersonRole(agreementPerson.agreementId, agreementPerson.personRoleId);
        }
    }));

    // If grader not in agreementperson, link them.
    await Promise.all(graders.map(async grader => {
        const personRole = await roleService.getPersonRole(grader.personId, agreement.studyfieldId, 'grader');
        if (personRole) {
            // If person exists as a grader and not already linked, link them
            if (!agreementPersons.find(agreementPerson => agreementPerson.personRoleId === personRole.personRoleId)) {
                roleService.linkAgreementAndPersonRole(agreement.agreementId, personRole.personRoleId);
            }
        } else {
            // If person has no grader role, make the person a grader and link them.
            const roleId = await roleService.getRoleId('grader');

            let personWithRole = {
                personId: grader.personId,
                studyfieldId: agreement.studyfieldId,
                roleId
            };
            personWithRole = await roleService.savePersonRole(personWithRole);
            roleService.linkAgreementAndPersonRole(agreement.agreementId, personWithRole.personRoleId);
        }
    }));
};
