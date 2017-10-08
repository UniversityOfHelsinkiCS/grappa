require('babel-polyfill');
const contractDao = require('../dao/ContractDao');
const express = require('express');
const app = express();

export async function getContractById(req, res) {
    const contract = await contractDao.getContractById(req.params.id);
    res.status(200).json(contract);
}

export async function saveContract(req, res) {
    const contractData = req.body;
    if(contractData.contractId !== "" && contractData.contractId !== undefined){
        try{
            const daoResponse = await contractDao.updateContract(contractData);
            res.status(200).json({text: "contract update successful", contractId: daoResponse});
        } catch (err) {
            res.status(500).json({text: "error occurred", error: err});
        }
    } else {
        try{
            const daoResponse = await contractDao.saveNewContract(contractData);
            res.status(200).json({text: "contract save successful", contractId: daoResponse});
        } catch (err) {
            res.status(500).json({text: "error occurred", error: err});
        }
    }
}
