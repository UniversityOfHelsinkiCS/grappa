require('babel-polyfill');
const contractDao = require('../dao/contractDao');
const express = require('express');
const app = express();
const output = require('../output');

module.exports = app;

export function getterContract(req, res)  {
    console.log("get onnistuu");
}

export function contract(req, res) {
    console.log(req.body);
    contractDao.saveContract(req.body);
    output.send(req.query.outputType, res.status(200), "ok");
}
