require('babel-polyfill');
const contractDao = require('../dao/ContractDao');
const express = require('express');
const app = express();

import { send } from '../output.js';

module.exports = app;

export function getterContract(req, res)  {
    console.log("get onnistuu");
}

export function contract(req, res) {
    console.log(req.body);
    contractDao.saveContract(req.body);
    send(req.query.outputType, res.status(200), "ok");
}
