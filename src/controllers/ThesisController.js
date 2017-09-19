require('babel-polyfill');
const thesisDao = require('../dao/ThesisDao');
const express = require('express');
const app = express();

import { send } from '../output.js';

module.exports = app;

app.get('/theses',  (req, res) => {
  send(req.query.outputType, res, thesisDao.getAllTheses());
})

app.get('/theses/:id', (req, res) => {
  send(req.query.outputType, res, thesisDao.getThesisById(req.params.id));
})