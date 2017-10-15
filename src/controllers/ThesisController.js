require('babel-polyfill');
const thesisDao = require('../dao/ThesisDao');
const express = require('express');
const app = express();

export async function getAllTheses(req, res) {
    const theses = await thesisDao.getAllTheses();
    res.status(200).json(theses);
}

export async function getThesisById(req, res) {
    const thesis = await thesisDao.getThesisById(req.params.id);
    res.status(200).json(thesis);
}
