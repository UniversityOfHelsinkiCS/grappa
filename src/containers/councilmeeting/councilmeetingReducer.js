const agreementSave = (state = [], action) => {
    switch (action.type) {
        case "COUNCILMEETING_GET_ALL_SUCCESS":
            return action.response;
        case "COUNCILMEETING_SAVE_ONE_SUCCESS":
            return  [...state, action.response];
        case "COUNCILMEETING_UPDATE_ONE_SUCCESS":
            return [...state.filter(meeting => meeting.id !== action.response.id), action.response];
        case "COUNCILMEETING_DELETE_ONE_SUCCESS":
            return state.filter(meeting => meeting.id !== action.response.id);
        default:
            return state;
    }
};

export default agreementSave;
