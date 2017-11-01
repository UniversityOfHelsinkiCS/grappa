const agreementSave = (state = [], action) => {
    switch (action.type) {
        case COUNCILMEETING_GET_ALL_SUCCESS:
            return state;
        case COUNCILMEETING_SAVE_ONE_SUCCESS:
            return state;
        case COUNCILMEETING_UPDATE_ONE_SUCCESS:
            return state;
        case COUNCILMEETING_DELETE_ONE_SUCCESS:
            return state;
        default:
            return state;
    }
};

export default agreementSave;
