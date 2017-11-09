require('babel-polyfill');
const supervisorService = require('../services/SupervisorService');
const personService = require('../services/PersonService');
const express = require('express');
const app = express();

export async function getAllSupervisors(req, res) {
    const supervisors = await supervisorService.getAllSupervisors();
    res.status(200).json(supervisors);
}

export async function getAgreementPersons(req, res) {
    const agreementPersons = await supervisorService.getAllAgreementPersons(); //in future will call getAlLAgreementPersonsNeedingAction
    res.status(200).json(agreementPersons);
}

export async function saveSupervisor(req, res) {
    const supervisorData = req.body;
    if (supervisorData.personId == null || supervisorData.personId == '') { //save new
        try {
            const supervisorRoleId = await supervisorService.getSupervisorRoleId();
            const personData = {
                firstname: supervisorData.firstname,
                lastname: supervisorData.lastname,
                title: supervisorData.title,
                email: supervisorData.email,
                shibbolethId: supervisorData.shibbolethId,
                isRetired: supervisorData.isRetired
            };
            const personId = await personService.savePerson(personData);
            const personRoleData = {
                personId: personId,
                studyfieldId: supervisorData.studyfieldId,
                roleId: supervisorRoleId
            };
            const personRoleId = await personService.savePersonRole(personRoleData);
            const agreementPersonData = {
                agreementId: supervisorData.agreementId,
                personRoleId: personRoleId,
                roleId: supervisorRoleId,
                approved: false,
                statement: ''
            };
            const agreementId = await supervisorService.saveAgreementPerson(agreementPersonData);
            res.status(200).json({ text: "supervisor save successful", personId: personId });
        } catch (err) {
            res.status(500).json({ text: "error occurred", error: err });
        }
    } else { //update
        try {
            const supervisorRoleId = await supervisorService.getSupervisorRoleId();
            const personData = {
                personId: supervisorData.personId,
                firstname: supervisorData.firstname,
                lastname: supervisorData.lastname,
                title: supervisorData.title,
                email: supervisorData.email,
                shibbolethId: supervisorData.shibbolethId,
                isRetired: supervisorData.isRetired
            };
            const personRoleData = {
                personId: supervisorData.personId,
                studyfieldId: supervisorData.studyfieldId,
                roleId: supervisorRoleId
            };
            const personRoleId = await personService.savePersonRole(personRoleData);
            const agreementPersonData = {
                agreementId: supervisorData.agreementId,
                personRoleId: personRoleId,
                roleId: supervisorRoleId,
                approved: false,
                statement: ''
            };
            
            const agreementId = await supervisorService.updateAgreementPerson(agreementPersonData);
            res.status(200).json({ text: "supervisor save successful", personId: personId });
        } catch (err) {
            res.status(500).json({ text: "error occurred", error: err });
        }
    }
}

export async function reviewSupervisor(req, res) {
    let data = req.body;
    if ((data.personRoleId != null || data.personRoleId === '') && (data.agreementId != null || data.agreementId === '')) {
        try {
            let agreementPersonData = {
                personRoleId: data.personRoleId,
                agreementId: data.agreementId,
                approved: data.approved,
                statement: data.statement,
                approverId: data.approverId,
                approvalDate: new Date().toJSON()
            };
            const response = await supervisorService.updateAgreementPerson(agreementPersonData);
            res.status(200).json({ text: "supervisor reviewed successfully", personRoleId: response });
        } catch (err) {
            res.status(500).json({ text: "error occured", error: err });
        }
    } else {
        res.status(500).json({ text: "agreementId and personRoleId are required" });
    }

}