

import thesesList from "../mockdata/Theses.js";

export const getAllTheses = () => {
    return thesesList;
}

export const getThesisById = (id) => { 
    for(let i = 0; i < thesesList.length; i++) {
        if (thesesList[i].id.toString() === id) {
            return thesesList[i];
        }
    }
    return null;
}

export const getThesisByStudyfield = (studyfield) => { 
    let thesesByStudyfield = [];
    for(let i = 0; i < thesesList.length; i++) {
        if (thesesList[i].studyFieldId === studyfield) {
            thesesByStudyfield.push(thesesList[i]);
        }
    }
    return thesesByStudyfield;
}