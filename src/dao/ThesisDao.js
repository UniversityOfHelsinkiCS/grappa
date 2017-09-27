import thesesList from "../mockdata/Theses.js";

const knex = require('../../connection');

export function getAllTheses() {
    var returnValue = knex.select().from('thesis')
    .then(function (theses) {
        returnValue = theses;
        console.log(returnValue);
        return theses;
    });
    return returnValue;
    // return Promise.all(promises);
}

export const getThesisById = (id) => {
    for (let i = 0; i < thesesList.length; i++) {
        if (thesesList[i].id.toString() === id) {
            console.log(thesesList[i]);
            return thesesList[i];
        }
    }
    return null;
}

export const getThesisByStudyfield = (studyfield) => {
    let thesesByStudyfield = [];
    for (let i = 0; i < thesesList.length; i++) {
        if (thesesList[i].studyFieldId === studyfield) {
            thesesByStudyfield.push(thesesList[i]);
        }
    }
    return thesesByStudyfield;
}