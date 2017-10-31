require('babel-polyfill');
const supervisorService = require('../services/SupervisorService');
const personService = require('../services/PersonService');
const express = require('express');
const app = express();

export async function getAllSupervisors(req, res) {
    const supervisors = await supervisorService.getAllSupervisors();
    console.log(supervisors);
    res.status(200).json(supervisors);
}

export async function saveSupervisor(req, res) {
    const supervisorData = req.body;
    if (supervisorData.personId == null || supervisorData.personId == '') {
        try {
            const supervisorRoleId = await supervisorService.getSupervisorRoleId();
            console.log('huhuhuhuh');
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
            res.status(200).json({text: "supervisor save successful", personId: personId});
        } catch (err) {
            res.status(500).json({text: "error occurred", error: err});
        }
    } else {
        console.log('huhuhuhih')
        res.status(500).json({text: "supervisor already exists"});
    }
}

export async function approveSupervisor(req, res) {
    // TO DO
}