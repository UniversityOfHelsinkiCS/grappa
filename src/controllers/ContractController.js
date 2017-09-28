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

export async function saveContract(req, res) {
    if(req.body.contractId !== "" && req.body.contractId !== undefined){
        const daoResponse = await contractDao.updateContract(req.body);
        send(req.query.outputType, res, daoResponse);
    } else {
        const daoResponse = await contractDao.saveNewContract(req.body);
        send(req.query.outputType, res, daoResponse);
    }
}
