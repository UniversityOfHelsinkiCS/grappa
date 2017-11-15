
const agreementService = require('../services/AgreementService');
const personService = require('../services/PersonService');
const thesisService = require('../services/ThesisService');
const emailService = require('../services/EmailService');


export async function getAgreementById(req, res) {
    const agreement = await agreementService.getAgreementById(req.params.id);
    const agreementPersons = await personService.getAgreementPersonsByAgreementId(req.params.id);
    res.status(200).json({ agreement: agreement, persons: agreementPersons });
}

export async function getPreviousAgreementById(req, res) {
    const agreement = await agreementService.getPreviousAgreementById(req.params.id);
    res.status(200).json(agreement);
}

export async function getAllAgreements(req, res) {
    const agreements = await agreementService.getAllAgreements();
    res.status(200).json(agreements);
}

const agreementHasNoId = (data) => {
    return data.agreementId === "" || data.agreementId == null;
}

const getPersonData = (data) => {
    const name = data.studentName; // THIS NEEDS TO BE FIXED
    const nameSplitted = name.split(" ");
    const personData = {
        personId: data.personId,
        firstname: (nameSplitted[0] ? nameSplitted[0] : ''),
        lastname: (nameSplitted[1] ? nameSplitted[1] : ''),
        studentNumber: data.studentNumber,
        email: data.studentEmail,
        major: data.studentMajor
    };
    return personData;
}

const getThesisData = (data) => {
    const thesisData = {
        thesisTitle: data.thesisTitle,
        startDate: data.thesisStartDate,
        completionEta: data.thesisCompletionEta,
        performancePlace:  data.thesisPerformancePlace
    };
    return thesisData;
}

const getAgreementData = (data, thesisId) => {
    const agreementData = {
        authorId: data.personId,
        thesisId: thesisId,
        responsibleSupervisorId: data.thesisSupervisorMain,
        studyFieldId: data.studyFieldId,
        studentGradeGoal: data.studentGradeGoal,
        studentWorkTime: data.thesisWorkStudentTime,
        supervisorWorkTime: data.thesisWorkSupervisorTime,
        intermediateGoal: data.thesisWorkIntermediateGoal,
        meetingAgreement: data.thesisWorkMeetingAgreement,
        other: data.thesisWorkOther
    };
    return agreementData;
}

export async function saveAgreement(req, res) {
    const data = req.body;
    data.personId = 1; //because front doesn't give id from shibboleth yet
    if (agreementHasNoId(data)) {
        const personData = getPersonData(data);
        const personSaveResponse = await updatePerson(personData);
        const thesisData = getThesisData(data);
        const thesisSaveResponse = await saveThesis(thesisData);
        const agreementData = getAgreementData(data, thesisSaveResponse);
        const agreementSaveResponse = await saveAgreementToService(agreementData);
        if (personSaveResponse && !thesisSaveResponse.errno && !agreementSaveResponse.errno) {
            personData.personId = personSaveResponse;
            thesisData.thesisId = thesisSaveResponse;
            agreementData.agreementId = agreementSaveResponse;
            emailService.agreementCreated(Object.assign(personData, thesisData, agreementData));
            res.status(200).json({ person: personData, thesis: thesisData, agreement: agreementData });
        } else {
            res.status(500).json({ text: "Error occured" });
        }
    } else {
        res.status(500).json({ text: "agreement already exists" });
    }
}

const updatePerson = async function(personData) {
   return await personService.updatePerson(personData);
}

const saveThesis = async function(thesisData) {
    return await thesisService.saveThesis(thesisData);
}

const saveAgreementToService = async function(agreementData) {
    return await agreementService.saveNewAgreement(agreementData);
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
            const receiver = await agreementService.getAgreementReceiver(agreementId);
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
                other: data.thesisWorkOther,
                whoNext: receiver
            };
            const cleanAgreementData = removeUselessKeys(agreementData);
            const agreementResponse = await agreementService.updateAgreement(cleanAgreementData);
            emailService.agreementUpdated(Object.assign(personData, thesisData, agreementData));
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
