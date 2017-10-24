require('babel-polyfill');
const supervisorService = require('../services/SupervisorService');
const express = require('express');
const app = express();

export async function getAllSupervisors(req, res) {
    const supervisors = await supervisorService.getAllSupervisors();
    res.status(200).json(supervisors);
}

export async function saveSupervisor(req, res) {
    const supervisorData = req.body;
    if (supervisorData.personId !== "" && supervisorData.personId !== undefined) {
        try {
            const response = await supervisorService.updateSupervisor(supervisorData);
            res.status(200).json({text: "supervisor update successful", personId: response});
        } catch (err) {
            res.status(500).json({text: "error occurred", error: err});
        }
    } else {
        try {
            const response = await supervisorService.saveNewSupervisor(supervisorData);
            res.status(200).json({text: "supervisor save successful", personId: response});
        } catch (err) {
            res.status(500).json({text: "error occurred", error: err});
        }
    }
}