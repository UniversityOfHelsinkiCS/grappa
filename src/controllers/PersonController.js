require('babel-polyfill');
const personService = require('../services/PersonService');
const express = require('express');
const app = express();

export async function updatePerson(req, res) {
    const data = req.body;
    const personData = {
        personId: data.personId,
        firstname: data.firstname,
        lastname: data.lastname,
        shibbolethId: data.shibbolethId,
        email: data.email,
        title: data.title,
        isRetired: data.isRetired
    };
    
    if (personData.personId != null || personData.personId != '') {
            let updateData = {};
            // remove useless keys from data
            Object.keys(personData).map(key => {
                if (personData[key] != null) {
                    updateData[key] = personData[key];
                }
            });
            let personId = await personService.updatePerson(updateData).then((response) =>  {
                res.status(200).json("person updated succesfully " + response);
            }
            ).catch(err => {
                res.status(500).json(err);
            });
        } 
     else {
        res.status(500).json({text: "person does not exist"});
    }
}

export async function getAllPersons(req, res) {
    const persons = await personService.getAllPersons();
    res.status(200).json(persons);
}

export async function getPersonById(req, res) {
    const person = await personService.getPersonById(req.params.id);
    res.status(200).json(person);
}
