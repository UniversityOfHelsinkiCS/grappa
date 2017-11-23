require('babel-polyfill');
const studyFieldService = require('../services/StudyFieldService');
const express = require('express');
const app = express();

export async function getAllStudyFields(req, res) {
    const studyfields = await studyFieldService.getAllStudyFields();
    res.status(200).json(studyfields);
}
