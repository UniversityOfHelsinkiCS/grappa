require('babel-polyfill');
const contractDao = require('../dao/ContractDao');
const express = require('express');
const app = express();

import { send } from '../output.js';


export function getContract(req, res) {
    send(req.query.outputType, res.status(200), contractDao.getContract());
}

export function saveContract(req, res) {
    console.log(req.body);
    send(req.query.outputType, res.status(200), contractDao.saveContract(req));
}

//theses list implemented this way, not sure if better or not

//app.get('/contract', (req, res) => {
  //  send(req.query.outputType, res.status(200), contractDao.getContract());
//})
