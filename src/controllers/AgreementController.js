const agreementService = require('../services/AgreementService');
const personService = require('../services/PersonService');
const thesisService = require('../services/ThesisService');
const emailService = require('../services/EmailService');
const roleService = require('../services/RoleService');
const studyfieldService = require('../services/StudyfieldService');
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

        const rolesInStudyfields = await getUsersRoles(user);

        // f user is an admin, get everything
        if (rolesInStudyfields.find(item => item.role.name === 'admin')) {
            agreements = await agreementService.getAllAgreements();
            res.status(200).json(agreements).end();
            return;
        }

        rolesInStudyfields.forEach(async item => {
            // As resp_prof, print-person and manager persons who are writing theses in studyfield
            if (item.role.name === 'resp_professor' || item.role.name === 'print-person' || item.role.name === 'manager') {
                newAgreements = await agreementService.getAgreementsInStudyfield(item.studyfield.studyfieldId);
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
        let response = [];
        agreements.forEach(agreement => {
            if (!response.find(item => item.agreementId === agreement.agreementId)) {
                response.push(agreement);
            }
        })
        res.status(200).json(response);
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}

const getUsersRoles = async(user) => {
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

export async function getAgreementsByLoggedAuthor(req, res) {
    // return agreements where user is set as author.
    try {
        const person = await personService.getLoggedPerson(req);
        const agreements = await agreementService.getAgreementsByAuthor(person.personId);
        // TODO! refactor frontend and call getAgreementRelatedData here
        res.status(200).json(agreements);
    } catch (err) {
        res.status(500).json(err);
    }
}

const getAgreementRelatedData = async function(data) {
    const mainSupervisor = await personService.getPersonByPersonRoleId(data.responsibleSupervisorId);
    data.responsibleSupervisorId = mainSupervisor;
    let agreement = getAgreementData(data);
    const thesis = getThesisData(data);
    const author = getPersonData(data);
    let supervisors = await getAgreementPersonsByAgreementId(agreement.agreementId);
    const agreementRelatedData = {
        agreement: agreement,
        thesis: thesis,
        author: author,
        supervisors: supervisors
    };
    return agreementRelatedData;
};

const getAgreementPersonsByAgreementId = async function(agreementId) {
    return await personService.getAgreementPersonsByAgreementId(agreementId);
};

const getThesisData = (data) => {
    return ({
        thesisId: data.thesisId,
        title: data.thesisTitle,
        userId: data.personId
    });
};

const getAgreementData = (data, thesisId) => {
    return ({
        agreementId: data.agreementId,
        authorId: data.personId,
        thesisId: thesisId,
        responsibleSupervisorId: data.thesisSupervisorMain,
        studyfieldId: data.studyfieldId,
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
};

const getPersonData = (data) => {
    return ({
        personId: data.personId,
        shibbolethId: data.shibbolethId,
        email: data.email,
        title: data.title,
        firstname: data.firstname,
        lastname: data.lastname,
        isRetired: data.isRetired,
        address: data.address,
        phone: data.phone,
        major: data.major
    });
};

export async function saveAgreement(req, res) {
    const data = req.body;
    const user = await personService.getLoggedPerson(req);
    const personId = user.personId;
    // console.log('Saving agreement');
    if (!personId) res.status(500).json({ text: 'No user_id in session' });
    if (!data.agreementId) {
        try {
            console.log('Before await');
            let newAgreement = await agreementService.saveAgreement(data);
            notificationService.createNotification('AGREEMENT_SAVE_ONE_SUCCESS', req, data.studyfieldId);
            return res.status(200).json(newAgreement);
        } catch (err) {
            return res.status(500).json(err);
        }
    }
    res.status(500).json({ text: 'Agreement had an id' });
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
        notificationService.createNotification('AGREEMENT_SAVE_ONE_SUCCESS', req, agreementData.studyfieldId);
        res.status(200).json(agreementData);
    }
    catch (error) {
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
            notificationService.createNotification('AGREEMENT_UPDATE_ONE_SUCCESS', req, agreementData.studyfieldId);
            res.status(200).json({ text: 'agreement update successfull(/SQL error)', agreementId: agreementId });
        } catch (err) {
            res.status(500).json({ text: 'error occurred', error: err });
        }
    } else {
        res.status(500).json({ text: 'problem with agreementId' });
    }
}

function removeUselessKeys(messyData) {
    // removes keys that are undefined/null from data
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
        notificationService.createNotification('AGREEMENT_SAVE_PERVIOUS_SUCCESS', req, data.studyfieldId);
        res.status(200).json({ text: 'agreement linked to previous agreement successfully', agreementId: daoResponse });
    } catch (err) {
        res.status(500).json({ text: 'error occurred', error: err });
    }
}
