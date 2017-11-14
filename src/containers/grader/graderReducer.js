const reducer = (state = [], action) => {
    switch (action.type) {
        case "GRADER_SAVE_ONE_SUCCESS":
            return [...state, action.response.data];
        case "GRADER_GET_ALL_SUCCESS":
            return action.response.data;
        case "GRADER_DELETE_ONE_SUCCESS":
            return state.filter(grader => grader.personId !== action.response.data.personId);
        case "GRADER_REVIEW_ONE_SUCCESS":
            console.log(action);
            return [...state, action.response.data];
        default:
            return state;
    }
};

export default reducer;
