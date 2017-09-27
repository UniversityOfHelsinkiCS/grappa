require('babel-polyfill');
const contractDao = require('../dao/ContractDao');
const express = require('express');
const app = express();

import { send } from '../output.js';

export function getContractById(req, res) {
    contractDao.getContractById(req.params.id)
        .then(contract => {
            send(req.query.outputType, res.status(200), contract);
        })
}

export function saveContract(req, res) {
    if(req.body.contractId !== "" && req.body.contractId !== undefined){

        send(req.query.outputType, res, contractDao.updateContract(req.body));
    } else {
        send(req.query.outputType, res, contractDao.saveNewContract(req.body));
    }
}
