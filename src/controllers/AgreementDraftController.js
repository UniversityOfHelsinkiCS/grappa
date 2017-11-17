require('babel-polyfill');
const draftService = require('../services/DraftService');
const supervisorService = require('../services/SupervisorService');
const express = require('express');
const app = express();

export async function getAgreementDraftById(req, res) {
    const agreementDraftId = req.params.id;
    if (agreementDraftId > 0) {
        try {
            const agreementDraft = await draftService.getAgreementDraftById(agreementDraftId);
            const agreementDraftPersons = await draftService.getAgreementDraftPersonsByAgreementDraftId(agreementDraftId);
            res.status(200).json({ agreementDraft: agreementDraft, agreementDraftPerson: agreementDraftPersons });
        } catch (error) {
            res.status(500).json({ text: "error occured", error: error });
        }
    } else {
        res.status(500).json({ text: "invalid agreementDraftId" });
    }
}

export async function saveAgreementDraft(req, res) {
    const data = req.body;
    try {
        const agreementDraftData = getAgreementDraftData(data);
        let agreementResponse;
        let textResponse;
        if (agreementDraftData.agreementDraftId > 0) {
            agreementResponse = await draftService.updateAgreementDraft(agreementDraftData);
            textResponse = "agreementDraft updated successfully";
        } else {
            agreementResponse = await draftService.saveNewAgreementDraft(agreementDraftData);
            // const supervisors = await getSupervisorsByEmails(data.emails);
            // const agreementDraftPersons = await saveAgreementDraftPersons(supervisors, agreementDraftId);
            textResponse = "new agreementDraft saved successfully";
        }
        res.status(200).json({ agreementDraft: agreementResponse, text: textResponse });
    } catch (error) {
        res.status(500).json({ text: "error occured", error: error });
    }
}

async function saveAgreementDraftPersons(supervisorData, agreementDraftId) {
    try {
        // TO DO: check if agreementDraftPerson already exists!!
        const agreementDraftPersonData = {
            agreementDraftId: agreementDraftId,
            personRoleId: supervisorData.personRoleId
        };
        const response = await draftService.saveAgreementDraftPerson(agreementDraftPersonData);
    } catch(error) {
        res.status(500).json({ text: "error occured", error: error });
    }
}

async function getSupervisorsByEmails(emails) {
    let supervisors = [];
    emails.forEach(async email => {
        try {
            console.log(email);
            let supervisor = await supervisorService.getSupervisorByEmail(email);
            supervisors.push(supervisor);
        } catch (error) {
            console.log(error);
            throw error;
        }
    })
    return supervisors;
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
        thesisStartDate: data.thesisStartDate,
        thesisCompletionEta: data.thesisCompletionEta,
        thesisPerformancePlace: data.thesisPerformancePlace,
        studentGradeGoal: data.studentGradeGoal,
        studentTime: data.studentTime,
        supervisorTime: data.supervisorTime,
        intermediateGoal: data.intermediateGoal,
        meetingAgreement: data.meetingAgreement,
        other: data.other
    }
    return agreementDraftData;
}
