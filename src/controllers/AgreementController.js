require('babel-polyfill');
const agreementDao = require('../dao/AgreementDao');
const express = require('express');
const app = express();

export async function getAgreementById(req, res) {
    const agreement = await agreementDao.getAgreementById(req.params.id);
    res.status(200).json(agreement);
}

export async function saveAgreement(req, res) {
    const agreementData = req.body;
    if(agreementData.agreementId !== "" && agreementData.agreementId !== undefined){
        try{
            const daoResponse = await agreementDao.updateAgreement(agreementData);
            res.status(200).json({text: "agreement update successful", agreementId: daoResponse});
        } catch (err) {
            res.status(500).json({text: "error occurred", error: err});
        }
    } else {
        try{
            const daoResponse = await agreementDao.saveNewAgreement(agreementData);
            res.status(200).json({text: "agreement save successful", agreementId: daoResponse});
        } catch (err) {
            res.status(500).json({text: "error occurred", error: err});
        }
    }
}
