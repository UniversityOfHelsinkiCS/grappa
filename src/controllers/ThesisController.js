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
    console.log("ENNEN");
    thesisService.saveThesis(thesisData).then((response) =>  {
        console.log("response " + JSON.stringify(response));
        res.status(200).json("Thesis saved succesfully " + response);
    }
    ).catch(err => {
        console.log("error " + err);
        res.status(500).json("Error occured when saving theses ");
        console.log("STATUS 500 JÄLKEEN!");
    });
    //res.status(500).json("Error occured when saving theses ");
}
