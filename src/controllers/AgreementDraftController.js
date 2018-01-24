import moment from 'moment';

require('babel-polyfill');
const draftService = require('../services/DraftService');
const supervisorService = require('../services/SupervisorService');
const notificationService = require('../services/NotificationService');

export async function getAgreementDraftById(req, res) {
    const agreementDraftId = req.params.id;
    if (agreementDraftId > 0) {
        try {
            const agreementDraft = await draftService.getAgreementDraftById(agreementDraftId);
            const draftPersons = await draftService.getAgreementDraftPersonsByAgreementDraftId(agreementDraftId);
            res.status(200).json({ agreementDraft, agreementDraftPersons: draftPersons });
        } catch (error) {
            res.status(500).json({ text: 'error occured', error });
        }
    } else {
        res.status(500).json({ text: 'invalid agreementDraftId' });
    }
}

export async function saveAgreementDraft(req, res) {
    const data = req.body;
    const agreementDraftData = getAgreementDraftData(data);
    let savedAgreementDraft;
    let agreementDraftId = data.agreementDraftId;

    try {
        if (agreementDraftId > 0) {
            const agreementResponse = await draftService.updateAgreementDraft(agreementDraftData);
            // TODO: why is agreementResponse always 1 here??
            savedAgreementDraft = await draftService.getAgreementDraftById(agreementResponse);
            notificationService.createNotification('AGREEMENT_DRAFT_UPDATE_ONE_SUCCESS', req);
        } else {
            const agreementResponse = await draftService.saveNewAgreementDraft(agreementDraftData);
            savedAgreementDraft = await draftService.getAgreementDraftById(agreementResponse);
            agreementDraftId = agreementResponse;
            notificationService.createNotification('AGREEMENT_DRAFT_SAVE_ONE_SUCCESS', req);
        }
        if (data.emails) {
            const supervisors = await getSupervisorsByEmails(data.emails);
            await removeAgreementDraftPersons(agreementDraftId);
            await saveAgreementDraftPersons(supervisors, agreementDraftId);
        }
        res.status(200).json(savedAgreementDraft);
    } catch (error) {
        console.log(error);
        res.status(500).json({ text: 'error occured', error });
    }
}

async function saveAgreementDraftPersons(draftPersons, agreementDraftId) {
    draftPersons.forEach(async (element) => {
        const draftPerson = {
            agreementDraftId,
            personRoleId: element.personRoleId
        };
        try {
            await draftService.saveAgreementDraftPerson(draftPerson);
        } catch (error) {
            throw error;
        }
    });
}

async function removeAgreementDraftPersons(agreementDraftId) {
    try {
        await draftService.removeAgreementDraftPersons(agreementDraftId);
    } catch (err) {
        throw err;
    }
}

async function getSupervisorsByEmails(emails) {
    const supervisors = [];
    try {
        for (let i = 0; emails.length > i; i++) {
            const supervisor = await supervisorService.getSupervisorByEmail(emails[i]);
            if (supervisor) {
                supervisors.push(supervisor);
            }
        }
        return supervisors;
    } catch (error) {
        throw error;
    }
}

const getAgreementDraftData = (data) => {
    const agreementDraftData = {
        agreementDraftId: data.agreementDraftId,
        mainSupervisorId: data.mainSupervisorId,
        studentEmail: data.studentEmail,
        studentFirstname: data.studentFirstname,
        studentLastname: data.studentLastname,
        studentNumber: data.studentNumber,
        studentAddress: data.studentAddress,
        studentPhone: data.studentPhone,
        studentMajor: data.studentMajor,
        thesisTitle: data.thesisTitle,
        thesisStartDate: moment(data.thesisStartDate).toDate(),
        thesisCompletionEta: moment(data.thesisCompletionEta).toDate(),
        thesisPerformancePlace: data.thesisPerformancePlace,
        studentGradeGoal: data.studentGradeGoal,
        studentTime: data.studentTime,
        supervisorTime: data.supervisorTime,
        intermediateGoal: data.intermediateGoal,
        meetingAgreement: data.meetingAgreement,
        other: data.other
    };

    // TODO: Fix this mapping

    if (!agreementDraftData.agreementDraftId)
        delete agreementDraftData.agreementDraftId;

    return agreementDraftData;
}
