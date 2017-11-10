require('babel-polyfill');
const agreementService = require('../services/AgreementService');
const personService = require('../services/PersonService');
const thesisService = require('../services/ThesisService');
const express = require('express');
const app = express();

export async function getAgreementById(req, res) {
    const agreement = await agreementService.getAgreementById(req.params.id);
    res.status(200).json(agreement);
}

export async function getPreviousAgreementById(req, res) {
    const agreement = await agreementService.getPreviousAgreementById(req.params.id);
    res.status(200).json(agreement);
}

export async function getAllAgreements(req, res) {
    const agreements = await agreementService.getAllAgreements();
    res.status(200).json(agreements);
}

const agreementHasNoId = function(data) {
    return data.agreementId === "" || data.agreementId == null;
} 
const getPersonData = function(data) {
    const personData = {
        personId: data.personId,
        firstname: data.studentFirstName,
        lastname: data.studentLastName,
        studentNumber: data.studentNumber,
        email: data.studentEmail,
        major: data.studentMajor
    };
    return personData;
}

const getThesisData = function(data) {
    const thesisData = {
        thesisTitle: data.thesisTitle,
        startDate: data.thesisStartDate,
        completionEta: data.thesisCompletionEta,
        performancePlace:  data.thesisPerformancePlace
    };
    return thesisData;
}

const getAgreementData = function(data, thesisId) {
    const agreementData = {
        authorId: data.personId,
        thesisId: thesisId,
        responsibleSupervisorId: data.responsibleSupervisorId,
        studyFieldId: data.studyFieldId,
        studentGradeGoal: data.studentGradeGoal,
        studentWorkTime: data.thesisWorkStudentTime,
        supervisorWorkTime: data.thesisWorkSupervisorTime,
        intermediateGoal: data.thesisWorkIntermediateGoal,
        meetingAgreement: data.thesisWorkMeetingAgreement,
        other: data.thesisWorkOther
    };
}
export async function saveAgreement(req, res) {
    const data = req.body;
    if (agreementHasNoId(data)) {
        const personData = getPersonData(data);
        const personUpdatedSuccessfully = await updatePerson(personData);
        console.log("PERSON UPDATE " + JSON.stringify(personUpdatedSuccessfully));
        const thesisData = getThesisData(data);
        const thesisSaveInformation = saveThesis(data);
        console.log("thesisSaveInformation " + JSON.stringify(thesisSaveInformation));
        const agreementData = getAgreementData(data, thesisSaveInformation.id);
        const agreementSavedSuccesfully = saveAgreementToService(agreementData);
        if (personUpdatedSuccessfully && thesisSaveInformation.success && agreementSavedSuccesfully) {
            res.status(200).json({text: "Agreement saved successfully"});
            }
        else {
            console.log("personUpdatedSuccesfully " + personUpdatedSuccessfully);
            console.log("thesisSave " + thesisSaveInformation.success);
            console.log("agreementSave " + JSON.stringify(agreementSavedSuccesfully));
            res.status(500).json({text: "Error occured"});
        }
        
    } else {
        res.status(500).json({ text: "agreement already exists" });
    }
}

const updatePerson = async function(personData) {
    await personService.updatePerson(personData).then((response) => {
        console.log("Personin päivitys onnistui");
        return true;
    }).catch(err => {
        console.log("Personin päivitys epäonnistui");
        return false;
    });
}

const saveThesis = async function(thesisData) {
    await thesisService.saveThesis(thesisData).then((response) =>  {
        return {success: true, id: response};
    }
    ).catch(err => {
        return {success: false, id: null};
    });
}

const saveAgreementToService = async function(agreementData) {
    await agreementService.saveNewAgreement(agreementData).then((response) => {
        return true;
    }).catch(err => {
        return false;
    })
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
                major: data.studentMajor
            };
            const cleanPersonData = removeUselessKeys(personData);
            const personResponse = await personService.updatePerson(cleanPersonData);
            const thesisData = {
                thesisId: data.thesisId,
                thesisTitle: data.thesisTitle,
                startDate: data.thesisStartDate,
                completionEta: data.thesisCompletionEta,
                performancePlace:  data.thesisPerformancePlace
            };
            const cleanThesisData = removeUselessKeys(thesisData);
            const thesisResponse = await thesisService.updateThesis(cleanThesisData);
            const agreementData = {
                agreementId: agreementId,
                authorId: data.personId,
                thesisId: data.thesisId,
                responsibleSupervisorId: data.responsibleSupervisorId,
                studyFieldId: data.studyFieldId,
                studentGradeGoal: data.studentGradeGoal,
                studentWorkTime: data.thesisWorkStudentTime,
                supervisorWorkTime: data.thesisWorkSupervisorTime,
                intermediateGoal: data.thesisWorkIntermediateGoal,
                meetingAgreement: data.thesisWorkMeetingAgreement,
                other: data.thesisWorkOther
            };
            const cleanAgreementData = removeUselessKeys(agreementData);
            const agreementResponse = await agreementService.updateAgreement(cleanAgreementData);
            res.status(200).json({ text: "agreement update successfull(/SQL error)", agreementId: agreementId });
        } catch (err) {
            res.status(500).json({ text: "error occurred", error: err });
        }
    } else {
        res.status(500).json({ text: "problem with agreementId" });
    }
}

function removeUselessKeys(messyData) {
    //removes keys that are undefined/null from data
    let cleanData = {};
    Object.keys(messyData).map(key => {
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
        res.status(200).json({ text: "agreement linked to previous agreement successfully", agreementId: daoResponse });
    } catch (err) {
        res.status(500).json({ text: "error occurred", error: err });
    }
}

