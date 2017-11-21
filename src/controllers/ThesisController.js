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
    const data = req.body;
    try {
        let response = await thesisService.saveThesis(data);
        res.status(200).json({ text: "Thesis saved succesfully", thesisId: response });
    } catch (e) {
        res.status(500).json(e);
    }
}

function getThesisData(data) {
    let thesis = {
        thesisTitle: data.thesisTitle,
        startDate: data.startDate,
        completionEta: data.completionEta,
        performancePlace: data.performancePlace,
        urkund: data.urkund,
        grade: data.grade,
        graderEval: data.graderEval,
        userId: data.authorId
    };
    return thesis;
}