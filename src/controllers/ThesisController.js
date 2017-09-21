require('babel-polyfill');
const thesisDao = require('../dao/ThesisDao');
const express = require('express');
const app = express();

import { send } from '../output.js';

export function getAllTheses (req, res) {
    send(req.query.outputType, res.status(200), thesisDao.getAllTheses());
}

export function getThesisById (req, res) {
    send(req.query.outputType, res.status(200), thesisDao.getThesisById(req.params.id));
}
