require('babel-polyfill');
const thesisDao = require('../dao/thesisDao');
const express = require('express');
const app = express();
const output = require('./src/output');

module.exports = app;

app.get('/theses',  (req, res) => {
  output.send(req.query.outputType, res, thesisDao.getTheses());
})
