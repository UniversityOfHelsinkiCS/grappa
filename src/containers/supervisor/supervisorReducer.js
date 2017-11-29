const reducer = (state = [], action) => {
    switch (action.type) {
        case "SUPERVISOR_SAVE_ONE_SUCCESS":
            return [...state, action.response];
        case "SUPERVISOR_GET_ALL_SUCCESS":
            return action.response;
        case "SUPERVISOR_GET_AGREEMENT_PERSONS_SUCCESS":
            return action.response;
        case "SUPERVISOR_DELETE_ONE_SUCCESS":
            return state.filter(supervisor => supervisor.personId !== action.response.personId);
        case "SUPERVISOR_REVIEW_ONE_SUCCESS":
            return [...state, action.response];
        case "SUPERVISOR_UPDATE_ONE_SUCCESS":
            return [...state.filter(supervisor => supervisor.id === action.response.id), action.response];
        default:
            return state;
    }
};

export default reducer;
