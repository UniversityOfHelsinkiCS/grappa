import logger from '../util/logger';

const agreementService = require('../services/AgreementService');
const attachmentService = require('../services/AttachmentService');
const personService = require('../services/PersonService');
const thesisService = require('../services/ThesisService');
const emailService = require('../services/EmailService');
const roleService = require('../services/RoleService');
const notificationService = require('../services/NotificationService');

export async function getAgreementById(req, res) {
    const agreement = await agreementService.getAgreementById(req.params.id);
    res.status(200).json(agreement);
}

export async function getPreviousAgreementById(req, res) {
    const agreement = await agreementService.getPreviousAgreementById(req.params.id);
    res.status(200).json(agreement);
}

// TODO: refactor
export async function getAllAgreements(req, res) {
    // All = return agreements that a user might be interested in.
    try {
        const user = await personService.getLoggedPerson(req);
        const personId = user.personId;
        let agreements = [];
        let newAgreements = [];

        const rolesInProgrammes = await roleService.getUsersRoles(user);

        // If user is an admin, get everything
        if (rolesInProgrammes.find(item => item.role.name === 'admin')) {
            agreements = await agreementService.getAllAgreements();
            const attachments = await attachmentService.getAllAttachments();
            const responseObject = {
                agreements,
                attachments
            };
            res.status(200).json(responseObject).end();
            return;
        }

        rolesInProgrammes.forEach(async (item) => {
            // As resp_prof, print-person and manager persons who are writing theses in programme
            if (item.role.name === 'resp_professor' || item.role.name === 'print-person' || item.role.name === 'manager') {
                newAgreements = await agreementService.getAgreementsInProgramme(item.programme.programmeId);
                agreements = [...new Set([...agreements, ...newAgreements])];
            }
        });

        // Get all where agreementPerson
        newAgreements = await agreementService.getAgreementsByAgreementPerson(personId);
        agreements = [...new Set([...agreements, ...newAgreements])];

        // Get all where user is the author.
        newAgreements = await agreementService.getAgreementsByAuthor(personId);
        agreements = [...new Set([...agreements, ...newAgreements])];

        // Remove duplicates
        const responseAgreements = [];
        agreements.forEach((agreement) => {
            if (!responseAgreements.find(item => item.agreementId === agreement.agreementId)) {
                responseAgreements.push(agreement);
            }
        });

        const attachments = await attachmentService.getAttachmentsForAgreements(responseAgreements);
        const responseObject = {
            agreements: responseAgreements,
            attachments
        };
        res.status(200).json(responseObject);
    } catch (error) {
        logger.error('Get agreements failed', { error });
        res.status(500).json(error);
    }
}

const getThesisData = data => ({
    thesisId: data.thesisId,
    title: data.thesisTitle
});

const getAgreementData = (data, thesisId) => ({
    agreementId: data.agreementId,
    authorId: data.personId,
    thesisId,
    responsibleSupervisorId: data.thesisSupervisorMain,
    programmeId: data.programmeId,
    startDate: data.thesisStartDate,
    completionEta: data.thesisCompletionEta,
    performancePlace: data.thesisPerformancePlace,
    studentGradeGoal: data.studentGradeGoal,
    studentWorkTime: data.thesisWorkStudentTime,
    supervisorWorkTime: data.thesisWorkSupervisorTime,
    intermediateGoal: data.thesisWorkIntermediateGoal,
    meetingAgreement: data.thesisWorkMeetingAgreement,
    other: data.other
});

export async function saveAgreement(req, res) {
    const data = req.body;
    const user = await personService.getLoggedPerson(req);
    const personId = user.personId;
    if (!personId) res.status(500).json({ text: 'No user_id in session' });
    if (!data.agreementId) {
        try {
            const newAgreement = await agreementService.saveAgreement(data);
            notificationService.createNotification('AGREEMENT_SAVE_ONE_SUCCESS', req, data.programmeId);
            return res.status(200).json(newAgreement);
        } catch (err) {
            logger.error('Save agreement failed', { error: err });
            return res.status(500).json(err);
        }
    }

    return res.status(500).json({ text: 'Agreement had an id' });
}

export async function saveAgreementForm(req, res) {
    const data = req.body;
    const user = await personService.getLoggedPerson(req);
    const personId = user.personId;
    data.personId = personId;
    if (!personId) {
        res.status(500).json({ text: 'No user_id in session' });
    }
    try {
        data.personId = personId;
        const thesisData = getThesisData(data);
        const thesisSaveResponse = await thesisService.saveThesis(thesisData, req);
        const agreementData = getAgreementData(data, thesisSaveResponse.thesisId);
        const agreementSaveResponse = await agreementService.saveAgreement(agreementData);
        agreementData.agreementId = agreementSaveResponse.agreementId;
        // let personData = await personService.getPersonById(data.personId);
        // emailService.agreementCreated(Object.assign(personData[0], thesisData, agreementData));
        notificationService.createNotification('AGREEMENT_SAVE_ONE_SUCCESS', req, agreementData.programmeId);
        res.status(200).json(agreementData);
    } catch (error) {
        logger.error('Save agreement form failed', { error });
        res.status(500).json({ text: 'Error occured', error });
    }
}

export async function updateAgreement(req, res) {
    const data = req.body;
    const agreementId = req.params.id;
    if (agreementId != null && agreementId !== '') {
        try {
            const personData = {
                personId: data.personId,
                firstname: data.studentFirstName,
                lastname: data.studentLastName,
                studentNumber: data.studentNumber,
                email: data.studentEmail,
                address: data.studentAddress,
                major: data.studentMajor
            };
            const cleanPersonData = removeUselessKeys(personData);

            await personService.updatePerson(cleanPersonData);

            const thesisData = {
                thesisId: data.thesisId,
                thesisTitle: data.thesisTitle,
                startDate: data.thesisStartDate,
                completionEta: data.thesisCompletionEta,
                performancePlace: data.thesisPerformancePlace
            };
            const cleanThesisData = removeUselessKeys(thesisData);

            await thesisService.updateThesis(cleanThesisData);

            const receiver = await agreementService.getAgreementReceiver(agreementId);
            const agreementData = {
                agreementId,
                authorId: data.personId,
                thesisId: data.thesisId,
                responsibleSupervisorId: data.responsibleSupervisorId,
                programmeId: data.programmeId,
                studentGradeGoal: data.studentGradeGoal,
                studentWorkTime: data.thesisWorkStudentTime,
                supervisorWorkTime: data.thesisWorkSupervisorTime,
                intermediateGoal: data.thesisWorkIntermediateGoal,
                meetingAgreement: data.thesisWorkMeetingAgreement,
                other: data.thesisWorkOther,
                whoNext: receiver
            };
            const cleanAgreementData = removeUselessKeys(agreementData);

            await agreementService.updateAgreement(cleanAgreementData);
            emailService.agreementUpdated(Object.assign(personData, thesisData, agreementData));
            notificationService.createNotification('AGREEMENT_UPDATE_ONE_SUCCESS', req, agreementData.programmeId);
            res.status(200).json({ text: 'agreement update successfull(/SQL error)', agreementId });
        } catch (err) {
            logger.error('Update agreement failed', { error: err });
            res.status(500).json({ text: 'error occurred', error: err });
        }
    } else {
        res.status(500).json({ text: 'problem with agreementId' });
    }
}

function removeUselessKeys(messyData) {
    // removes keys that are undefined/null from data
    const cleanData = {};
    Object.keys(messyData).map((key) => {
        if (messyData[key] != null) {
            cleanData[key] = messyData[key];
        }
    });
    return cleanData;
}

export async function savePrevious(req, res) {
    const data = req.body;
    try {
        const daoResponse = await agreementService.savePrevious(data);
        notificationService.createNotification('AGREEMENT_SAVE_PERVIOUS_SUCCESS', req, data.programmeId);
        res.status(200).json({ text: 'agreement linked to previous agreement successfully', agreementId: daoResponse });
    } catch (err) {
        logger.error('Save previous failed', { error: err });
        res.status(500).json({ text: 'error occurred', error: err });
    }
}
