require('babel-polyfill');
const thesisDao = require('../dao/ThesisDao');
const express = require('express');
const app = express();

import { send } from '../output.js';

export function getAllTheses(req, res) {
    //const theses = thesisDao.getAllTheses();
    //send(req.query.outputType, res.status(200), theses);

    thesisDao.getAllTheses().then(theses => {
       console.log(theses); 
       send(req.query.outputType, res.status(200), theses);
    });
    
}

export function getThesisById(req, res) {
    //console.log(req.params.id);
    const thesis = thesisDao.getThesisById(req.params.id);
    send(req.query.outputType, res.status(200), thesis);
    
}
