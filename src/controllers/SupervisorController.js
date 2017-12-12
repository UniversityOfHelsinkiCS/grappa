require('babel-polyfill');
const supervisorService = require('../services/SupervisorService');
const personService = require('../services/PersonService');
const roleService = require('../services/RoleService');
const express = require('express');
const app = express();

export async function getAllSupervisors(req, res) {
    const supervisors = await supervisorService.getAllSupervisors();
    res.status(200).json(supervisors);
}
export async function getAllSupervisorsByStudyfield(req, res) {
    const supervisors = await supervisorService.getAllSupervisorsByStudyfield(req.body.studyfieldId);
    res.status(200).json(supervisors);
}

export async function getAgreementPersons(req, res) {
    const agreementPersons = await supervisorService.getAllAgreementPersons();
    res.status(200).json(agreementPersons);
}
export async function getAgreementPersonsByStudyfield(req, res) {
    const agreementPersons = await supervisorService.getAllAgreementPersonsByStudyfield(req.body.studyfieldId);
    res.status(200).json(agreementPersons);
}

export async function saveSupervisor(req, res) {
    const supervisorData = req.body;
    if (supervisorData.personId == null || supervisorData.personId == '') { //save new
        try {
            const supervisorRoleId = await roleService.getRoleId("supervisor");
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
            personData.personId = personId;
            res.status(200).json(personData);
        } catch (err) {
            res.status(500).json({ text: "error occurred", error: err });
        }
    }
    else {
        res.status(500).json({ text: "person already has id"});
    }
}

export async function reviewSupervisor(req, res) {
    let data = req.body;
    console.log("controller")
    if (data.personRoleId != null && data.agreementId != null) {
        try {
            let agreementPersonData = {
                personRoleId: data.personRoleId,
                agreementId: data.agreementId,
                approved: data.approved,
                statement: data.statement,
                approverId: data.approverId,
                approvalDate: new Date().toJSON()
            };
            console.log("data.approved controller", data.approved);
            const response = await supervisorService.updateAgreementPerson(agreementPersonData);
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ text: "error occured", error: err });
        }
    } else {
        res.status(500).json({ text: "agreementId and personRoleId are required" });
    }

}

// export async function updateSupervisor(req, res) {
//     const data = req.body;
//     const personData = {
//         personId: data.personId,
//         firstname: data.firstname,
//         lastname: data.lastname,
//         shibbolethId: data.shibbolethId,
//         email: data.email,
//         title: data.title,
//         isRetired: data.isRetired
//     };
    
//     if (personData.personId != null || personData.personId != '') {
//             let updateData = {};
//             // remove useless keys from data
//             Object.keys(personData).map(key => {
//                 if (personData[key] != null) {
//                     updateData[key] = personData[key];
//                 }
//             });
//             let personId = await personService.updatePerson(updateData).then((response) =>  {
//                 res.status(200).json("person updated succesfully " + response);
//             }
//             ).catch(err => {
//                 res.status(500).json(err);
//             });
//         } 
//      else {
//         res.status(500).json({text: "person does not exist"});
//     }
// }