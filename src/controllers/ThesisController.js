require('babel-polyfill');
const thesisDao = require('../dao/ThesisDao');
const express = require('express');
const app = express();

import { send } from '../output.js';

export async function getAllTheses(req, res) {
    const theses = await thesisDao.getAllTheses();
    send(req.query.outputType, res.status(200), theses);
    /*thesisDao.getAllTheses()
        .then(theses => {
            send(req.query.outputType, res.status(200), theses);
        });
    */
}

export async function getThesisById(req, res) {
    const thesis = await thesisDao.getThesisById(req.params.id);
    send(req.query.outputType, res.status(200), thesis);
    //thesisDao.getThesisById(req.params.id)
    //    .then(thesis => {
    //        send(req.query.outputType, res.status(200), thesis);
    //    });
    
    
}
