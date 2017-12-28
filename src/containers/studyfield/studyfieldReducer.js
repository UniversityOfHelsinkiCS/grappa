const reducer = (state = [], action) => {
    switch (action.type) {
        case 'STUDYFIELD_GET_ALL_SUCCESS':
            return action.response;
        case 'STUDYFIELD_SAVE_ONE_SUCCESS':
            return [...state, action.response.data];
        case 'STUDYFIELD_UPDATE_ONE_SUCCESS':
            return [...state.filter(studyfield => studyfield.id === action.response.id), action.response];
        case 'STUDYFIELD_DELETE_ONE_SUCCESS':
            return state.filter(studyfield => studyfield.id !== action.response.data.id);
        default:
            return state;
    }
};

export default reducer;
