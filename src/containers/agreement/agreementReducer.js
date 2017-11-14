const reducer = (state = [], action) => {
    switch (action.type) {
        case "AGREEMENT_GET_ONE_SUCCESS":
            return [...state, action.response.data];
        case "AGREEMENT_SAVE_ONE_SUCCESS":
            return [...state, action.response.data];
        case "AGREEMENT_DELETE_ONE_SUCCESS":
            return state.filter(grader => grader.personId !== action.response.data.personId);
        default:
            return state;
    }
};

export default reducer;
