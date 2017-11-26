const reducer = (state = [], action) => {
    switch (action.type) {
        case "USER_GET_ALL_SUCCESS":
            return action.response;
        default:
            return state;
    }
};

export default reducer;
