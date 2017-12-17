const reducer = (state = [], action) => {
    switch (action.type) {
        case "USER_GET_ALL_SUCCESS":
            return action.response;
        case "THESIS_SAVE_ONE_SUCCESS":
            //Saving thesis response has multiple fields.
            return [...state, action.response.author];
        default:
            return state;
    }
};

export default reducer;
