require('babel-polyfill');
const contractDao = require('../dao/ContractDao');
const express = require('express');
const app = express();

import { send } from '../output.js';

export function getContract(req, res) {
    // turha metodi, mutta frontti käyttää tätä vielä (poista kun frontti ei käytä tätä)
    send(req.query.outputType, res.status(200), contractDao.getContract());
}

export function getContractById(req, res) {
    send(req.query.outputType, res.status(200), contractDao.getContractById(req.params.id));
}

export function saveContract(req, res) {
    console.log(req.body);
    send(req.query.outputType, res.status(200), contractDao.saveContract(req));
}
