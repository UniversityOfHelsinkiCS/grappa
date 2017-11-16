const reducer = (state = [], action) => {
    switch (action.type) {
        case "EMAILDRAFT_GET_ALL_SUCCESS":
            return action.response;
        case "EMAILDRAFT_SAVE_ONE_SUCCESS":
            return [...state, action.response];
        case "EMAILDRAFT_UPDATE_ONE_SUCCESS":
            return [...state.filter(draft => draft.id === action.response.id), action.response];
        case "EMAILDRAFT_DELETE_ONE_SUCCESS":
            return state.filter(draft => draft.id !== action.response);
        default:
            return state;
    }
};

export default reducer;
