require('babel-polyfill');
const thesisDao = require('../dao/ThesisDao');
const express = require('express');
const app = express();

const knex = require('../../connection');

import { send } from '../output.js';

export function getAllTheses(req, res) {
    thesisDao.getAllTheses().then(theses => {
        send(req.query.outputType, res.status(200), theses);
    });
}

export function getThesisById(req, res) {
    send(req.query.outputType, res.status(200), thesisDao.getThesisById(req.params.id));
}
