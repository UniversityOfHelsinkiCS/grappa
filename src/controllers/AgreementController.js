const agreementService = require('../services/AgreementService');
const personService = require('../services/PersonService');
const thesisService = require('../services/ThesisService');
const emailService = require('../services/EmailService');
const roleService = require('../services/RoleService');
const studyfieldService = require('../services/StudyfieldService');

const AttachmentController = require('./AttachmentController');

export async function getAgreementById(req, res) {
    const agreement = await agreementService.getAgreementById(req.params.id);
    res.status(200).json(agreement);
}

export async function getPreviousAgreementById(req, res) {
    const agreement = await agreementService.getPreviousAgreementById(req.params.id);
    res.status(200).json(agreement);
}

//TODO: refactor
export async function getAllAgreements(req, res) {
    //All = return agreements that a user might be interested in.
    try {
        let agreements = [];
        const personId = req.session.user_id        
        const roleToId = await roleService.getRoles();
        const studyfieldToId = await studyfieldService.getAllStudyfields();
        const personRoles = await roleService.getPersonRoles(personId);
        const readableRoles = personRoles.map(role => {
            return {
                studyfield: studyfieldToId.find(studyfieldIdPair => studyfieldIdPair.studyfieldId === role.studyfieldId).name,
                role: roleToId.find(roleIdPair => roleIdPair.roleId === role.roleId).name
            }
        })
        //First get all user is the "student" of.
        agreements = await agreementService.getAgreementsByAuthor(personId);
        //Get all if admin
        if (readableRoles.find(readable => readable.role === 'admin')) {
            const allAgreements = await agreementService.getAllAgreements();
            agreements.concat(allAgreements);
        } else {
            //Get all where agreementPerson
            const agreementsWhereAgreementPerson = await Promise.all(personRoles.map(async role => {
                const personRoleId = role.personRoleId;
                const agreementPersons = await personService.getAgreementPersonsByPersonRoleId(personRoleId);
                const agreements = await Promise.all(agreementPersons.map(async agreementPerson => {
                    const agreementId = agreementPerson.agreementId;
                    const agreement = await agreementService.getAgreementById(agreementId);
                    return agreement;
                }))
                return agreements[0];
            }))
            agreements.concat(agreementsWhereAgreementPerson);
        }
        res.status(200).json(agreements);
    } catch (err) {
        res.status(500).json(err);
    }
}

export async function getAgreementsByLoggedAuthor(req, res) {
    //return agreements where user is set as author.
    try {
        const person = await personService.getLoggedPerson(req);
        const agreements = await agreementService.getAgreementsByAuthor(person.personId);
        res.status(200).json(agreements);
    } catch (err) {
        res.status(500).json(err);
    }
}

const agreementHasNoId = (data) => {
    return !agreement.agreementId
}

const getThesisData = (data) => {
    return ({
        thesisTitle: data.thesisTitle,
        startDate: data.thesisStartDate,
        completionEta: data.thesisCompletionEta,
        performancePlace: data.thesisPerformancePlace,
        userId: data.personId
    });
}

const getAgreementData = (data, thesisId) => {
    return ({
        authorId: data.personId,
        thesisId: thesisId,
        responsibleSupervisorId: data.thesisSupervisorMain,
        studyfieldId: data.studyfieldId,
        studentGradeGoal: data.studentGradeGoal,
        studentWorkTime: data.thesisWorkStudentTime,
        supervisorWorkTime: data.thesisWorkSupervisorTime,
        intermediateGoal: data.thesisWorkIntermediateGoal,
        meetingAgreement: data.thesisWorkMeetingAgreement,
        other: data.thesisWorkOther
    });
}

export async function saveAgreement(req, res) {
    const data = req.body;
    const personId = req.session.user_id
    console.log("Saving agreement");
    if (!personId) res.status(500).json({ text: "No user_id in session" });
    if (!data.agreementId) {
        try {
            console.log("Before await");
            let newAgreement = await agreementService.saveAgreement(data);
            return res.status(200).json(newAgreement);
        } catch (err) {
            return res.status(500).json(err);
        }
    }
    res.status(500).json({ text: "Agreement had an id" });
}

export async function saveAgreementForm(req, res) {
    const data = req.body;
    const personId = req.session.user_id;
    if (!personId) res.status(500).json({ text: "No user_id in session" });
    if (agreementHasNoId(data)) {
        try {
            data.personId = personId;
            const thesisData = getThesisData(data);
            const thesisSaveResponse = await thesisService.saveThesis(thesisData);
            const agreementData = getAgreementData(data, thesisSaveResponse.id);
            const agreementSaveResponse = await agreementService.saveAgreement(agreementData);
            agreementData.agreementId = agreementSaveResponse.agreementId;
            let personData = await personService.getPersonById(data.personId);
            //emailService.agreementCreated(Object.assign(personData[0], thesisData, agreementData));
            res.status(200).json(agreementData);
        }
        catch (error) {
            res.status(500).json({ text: "Error occured", error });
        }
    } else {
        res.status(500).json({ text: "agreement already exists" });
    }
}

const updatePerson = async function (personData) {
    return await personService.updatePerson(personData);
}

const saveThesis = async function (thesisData) {
    return await thesisService.saveThesis(thesisData);
}

const saveAgreementToService = async function (agreementData) {
    const agreement = await agreementService.saveAgreement(agreementData);
    return agreement.agreementId;
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
                performancePlace: data.thesisPerformancePlace
            };
            const cleanThesisData = removeUselessKeys(thesisData);
            const thesisResponse = await thesisService.updateThesis(cleanThesisData);
            const receiver = await agreementService.getAgreementReceiver(agreementId);
            const agreementData = {
                agreementId: agreementId,
                authorId: data.personId,
                thesisId: data.thesisId,
                responsibleSupervisorId: data.responsibleSupervisorId,
                studyfieldId: data.studyfieldId,
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
