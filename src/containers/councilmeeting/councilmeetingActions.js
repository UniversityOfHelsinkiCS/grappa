import { callApi } from '../../util/apiConnection';

//GET
export const getAllStatus = (suffix, response) => {
    let text = "error with suffix"
    if (suffix === "ATTEMPT") {
        text = "Yritys alkoi"
    } else if (suffix == "SUCCESS") {
        text = "Onnistui"
    } else if (suffix == "FAILURE") {
        text = "Epäonnistui"
    }
    return {
        type: "COUNCILMEETING_GET_ALL_" + suffix,
        text,
        response
    }
}

export const getCouncilmeetings = () => {
    return (dispatch) => {
        dispatch(getAllStatus("ATTEMPT"));
        callApi('/councilmeetings', 'get')
            .then(res =>  dispatch(getAllStatus("SUCCESS", res)))
            .catch(err => dispatch(getAllStatus("FAILURE", err.response)));
    }
}

//SAVE
export const saveStatus = (suffix, response) => {
    let text = "error with suffix"
    if (suffix === "ATTEMPT") {
        text = "Yritys alkoi"
    } else if (suffix == "SUCCESS") {
        text = "Onnistui"
    } else if (suffix == "FAILURE") {
        text = "Epäonnistui"
    }
    return {
        type: "COUNCILMEETING_SAVE_" + suffix,
        text,
        response
    }
}

export const saveCouncilmeeting = (councilmeeting) => {
    return (dispatch) => {
        dispatch(saveStatus("ATTEMPT"));
        callApi('/councilmeeting', 'post', councilmeeting)
            .then(res =>  dispatch(saveStatus("SUCCESS", res)))
            .catch(err => dispatch(saveStatus("FAILURE", err.response)));
    }
}
//UPDATE
export const updateStatus = (suffix, response) => {
    let text = "error with suffix"
    if (suffix === "ATTEMPT") {
        text = "Yritys alkoi"
    } else if (suffix == "SUCCESS") {
        text = "Onnistui"
    } else if (suffix == "FAILURE") {
        text = "Epäonnistui"
    }
    return {
        type: "COUNCILMEETING_UPDATE_" + suffix,
        text,
        response
    }
}

export const updateCouncilmeeting = (councilmeeting) => {
    return (dispatch) => {
        dispatch(updateStatus("ATTEMPT"));
        callApi('/councilmeeting', 'put', councilmeeting)
            .then(res =>  dispatch(updateStatus("SUCCESS", res)))
            .catch(err => dispatch(updateStatus("FAILURE", err.response)));
    }
}

// DELETE
export const deleteStatus = (suffix, response) => {
    let text = "error with suffix"
    if (suffix === "ATTEMPT") {
        text = "Yritys alkoi"
    } else if (suffix == "SUCCESS") {
        text = "Onnistui"
    } else if (suffix == "FAILURE") {
        text = "Epäonnistui"
    }
    return {
        type: "COUNCILMEETING_UPDATE_" + suffix,
        text,
        response
    }
}

export const deleteCouncilmeeting = (councilmeeting) => {
    return (dispatch) => {
        dispatch(deleteStatus("ATTEMPT"));
        callApi('/councilmeeting', 'delete', councilmeeting)
            .then(res =>  dispatch(deleteStatus("SUCCESS", res)))
            .catch(err => dispatch(deleteStatus("FAILURE", err.response)));
    }
}