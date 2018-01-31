const reducer = (state = [], action) => {
    switch (action.type) {
        case 'THESIS_GET_ALL_SUCCESS':
            return action.response;
        case 'THESIS_SAVE_ONE_SUCCESS':
        // Saving thesis response has multiple fields.
            return [...state, action.response.thesis];
        case 'THESIS_UPDATE_ONE_SUCCESS':
            return [
                ...state.filter(thesis => thesis.thesisId !== action.response.thesis.thesisId), action.response.thesis
            ];
        case 'THESIS_DELETE_ONE_SUCCESS':
            return state.filter(thesis => thesis.thesisId !== action.response.updatedThesis.thesisId);
        default:
            return state;
    }
};

export default reducer;
