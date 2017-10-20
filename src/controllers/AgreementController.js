require('babel-polyfill');
const agreementService = require('../services/AgreementService');
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

export async function saveAgreement(req, res) {
    const agreementData = req.body;
    if (agreementData.agreementId !== "" && agreementData.agreementId !== undefined) {
        try {
            const daoResponse = await agreementService.updateAgreement(agreementData);
            res.status(200).json({ text: "agreement update successful", agreementId: daoResponse });
        } catch (err) {
            res.status(500).json({ text: "error occurred", error: err });
        }
    } else {
        try {
            const daoResponse = await agreementService.saveNewAgreement(agreementData);
            res.status(200).json({ text: "agreement save successful", agreementId: daoResponse });
        } catch (err) {
            res.status(500).json({ text: "error occurred", error: err });
        }
    }
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

