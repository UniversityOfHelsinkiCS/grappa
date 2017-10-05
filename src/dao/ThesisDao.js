import thesesList from "../mockdata/Theses.js";

const knex = require('../../connection');

// don't know if export function is better than export const? Both are working.

export function getAllTheses() {
    return knex.select().from('thesis')
        .then(theses => {
            return theses;
        });
}

export const getThesisById = (id) => {
    return knex.select().from('thesis').where('thesisId', id)
        .then(thesis => {
            return thesis;
        });
}

export const getThesisByStudyfield = (studyfield) => {
    // what is this? there is no studyfield table in db yet. This method uses mockdata.
    let thesesByStudyfield = [];
    for (let i = 0; i < thesesList.length; i++) {
        if (thesesList[i].studyFieldId === studyfield) {
            thesesByStudyfield.push(thesesList[i]);
        }
    }
    return thesesByStudyfield;
}