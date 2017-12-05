require('babel-polyfill');
const personService = require('../services/PersonService');
const express = require('express');
const app = express();

export async function addPerson(req, res) {
    const personData = getPersonData(req.body);
    const saveData = removeEmptyKeys(personData);
    if (saveData.personId === '' || saveData.personId == null) {
        let savedPerson = await personService.savePerson(saveData)
            .then(response => {
                res.status(200).json(savedPerson)
            })
            .catch(error => {
                res.status(500).json(error);
            });
    } else {
        res.status(500).json();
    }
}

export async function updatePerson(req, res) {
    const data = req.body;
    const personData = getPersonData(data);
    if (personData.personId != null || personData.personId != '') {
        const updateData = removeEmptyKeys(personData);
        let personId = await personService.updatePerson(updateData).then((response) => {
            res.status(200).json("person updated succesfully " + response);
        }
        ).catch(err => {
            res.status(500).json(err);
        });
    }
    else {
        res.status(500).json({ text: "person does not exist" });
    }
}

function getPersonData(data) {
    const personData = {
        personId: data.personId,
        firstname: data.firstname,
        lastname: data.lastname,
        shibbolethId: data.shibbolethId,
        email: data.email,
        title: data.title,
        isRetired: data.isRetired
    };
    return personData;
}

function removeEmptyKeys(data) {
    let parsedData = {};
    Object.keys(personData).map(key => {
        if (personData[key] != null) {
            updateData[key] = personData[key];
        }
    });
    return parsedData;
}

export async function getAllPersons(req, res) {
    const persons = await personService.getAllPersons();
    res.status(200).json(persons);
}

export async function getPersonById(req, res) {
    const person = await personService.getPersonById(req.params.id);
    res.status(200).json(person);
}
