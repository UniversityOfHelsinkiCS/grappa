require('babel-polyfill');
const thesisDao = require('../dao/ThesisDao');
const express = require('express');
const app = express();

import { send } from '../output.js';

export function getAllTheses(req, res) {
    thesisDao.getAllTheses().then(theses => {
        send(req.query.outputType, res.status(200), theses);
    });
}

export function getThesisById(req, res) {
    console.log(req.params.id);
    thesisDao.getThesisById(req.params.id).then(thesis => {
        send(req.query.outputType, res.status(200), thesis);
    });
}
