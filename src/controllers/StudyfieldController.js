require('babel-polyfill');
const studyfieldService = require('../services/StudyfieldService');
const express = require('express');
const app = express();

export async function getAllStudyfields(req, res) {
    const studyfields = await studyfieldService.getAllStudyfields();
    res.status(200).json(studyfields);
}
