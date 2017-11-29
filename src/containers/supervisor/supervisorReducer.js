const reducer = (state = [], action) => {
    switch (action.type) {
        case "SUPERVISOR_GET_ALL_SUCCESS":
            return action.response;
        default:
            return state;
    }
};

export default reducer;
