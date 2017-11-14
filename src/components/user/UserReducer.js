const changeUserRole = (state = [], action) => {
    switch (action.type) {
        case "CHANGE_ROLE_SUCCESS":
            return [...state,
            {
                id: action.type,
                role: action.data,
                text: action.text,
                formClass: "success",
                completed: true
            }];
        case "CHANGE_ROLE_FAILURE":
            return [...state,
            {
                id: action.type,
                text: action.text,
                formClass: "error",
                completed: true
            }];
        /*case CHANGE_ROLE_ATTEMPT:
            return [...state,
            {
                id: action.type,
                role: action.data,
                text: action.text,
                formClass: "",
                completed: false
            }];
        */
        default:
            return state;
    }
};

export default changeUserRole;
