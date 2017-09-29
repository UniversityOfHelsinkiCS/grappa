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
    const contractData = req.body;
    if(contractData.contractId !== "" && contractData.contractId !== undefined){
        try{
            const daoResponse = await contractDao.updateContract(contractData);
            send(req.query.outputType, res.status(200), {text: "update successed", contractId: daoResponse});
        } catch (err) {
            send(req.query.outputType, res.status(500), {text: "error occurred", error: err});
        }
    } else {
        try{
            const daoResponse = await contractDao.saveNewContract(contractData);
            send(req.query.outputType, res.status(200), {text: "save successed", contractId: daoResponse});
        } catch (err) {
            send(req.query.outputType, res.status(500), {text: "error occurred", error: err});
        }


    }
}
