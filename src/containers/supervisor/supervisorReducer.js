const reducer = (state = [], action) => {
    switch (action.type) {
        case "SUPERVISOR_GET_ALL_SUCCESS":
            return [...state, action.response.data];
        default:
            return state;
    }
};

export default reducer;
