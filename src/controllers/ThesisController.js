require('babel-polyfill');
const thesisService = require('../services/ThesisService');
const express = require('express');
const app = express();

export async function getAllTheses(req, res) {
    const theses = await thesisService.getAllTheses();
    res.status(200).json(theses);
}

export async function getThesisById(req, res) {
    const thesis = await thesisService.getThesisById(req.params.id);
    res.status(200).json(thesis);
}

export async function saveThesis(req, res) {
    const thesisData = req.body;
    console.log("Yritän tallettaa datan " + JSON.stringify(thesisData));
        try {
            console.log("YRITIN!!!")
            const daoResponse = await thesisService.saveThesis(thesisData);
            res.status(200).json({ text: "agreement update successful", agreementId: daoResponse });
        } catch (err) {
            console.log("EPÄONNISTUIN " + err)
            res.status(500).json({ text: "error occurred", error: err });
        }
}
