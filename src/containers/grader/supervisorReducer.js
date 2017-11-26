const reducer = (state = [], action) => {
    switch (action.type) {
        case "SUPERVISOR_SAVE_ONE_SUCCESS":
            return [...state, action.response.data];
        case "SUPERVISOR_GET_ALL_SUCCESS":
            return action.response.data;
        case "SUPERVISOR_DELETE_ONE_SUCCESS":
            return state.filter(supervisor => supervisor.personId !== action.response.data.personId);
        case "SUPERVISOR_REVIEW_ONE_SUCCESS":
            return [...state, action.response.data];
        case "SUPERVISOR_UPDATE_ONE_SUCCESS":
            //return [...state, action.response.data];
            return [...state.filter(supervisor => supervisor.id === action.response.id), action.response];
            //return [...state.filter(meeting => meeting.id === action.response.id), action.response];
        default:
            return state;
    }
};

export default reducer;
