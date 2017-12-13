const reducer = (state = [], action) => {
    switch (action.type) {
        case "AGREEMENT_GET_ALL_SUCCESS":
            return action.response;
        case "AGREEMENT_GET_ONE_SUCCESS":
            return [...state, action.response];
        case "AGREEMENT_UPDATE_ONE_SUCCESS":
            return [...state.filter(agreement => agreement.id !== action.response.id), action.response];
        case "AGREEMENT_SAVE_ONE_SUCCESS":
            return [...state, action.response];
        case "AGREEMENT_DELETE_ONE_SUCCESS":
            return state.filter(agreement => agreement.id !== action.response);
        case "ATTACHMENT_SAVE_ONE_SUCCESS":
            console.log("acton.response", action.response)
            return [...state, action.response];
        case "THESIS_SAVE_ONE_SUCCESS":
            //Saving thesis response has multiple fields.
            return [...state, action.response.agreement];
        default:
            return state;
    }
};

export default reducer;
