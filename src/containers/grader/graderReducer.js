const reducer = (state = [], action) => {
    switch (action.type) {
        case "GRADER_GET_ALL_SUCCESS":
            return action.response;
        case "GRADER_SAVE_ONE_SUCCESS":
            return [...state, action.response];
        case "GRADER_DELETE_ONE_SUCCESS":
            return state.filter(grader => grader.personId !== action.response.personId);
        case "GRADER_UPDATE_ONE_SUCCESS":
            return [...state.filter(grader => grader.id === action.response.id), action.response];
        default:
            return state;
    }
};

export default reducer;