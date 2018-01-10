const reducer = (state = [], action) => {
    switch (action.type) {
        case 'THESIS_SAVE_ONE_SUCCESS':
            return action.response.roles;
        case 'THESIS_UPDATE_ONE_SUCCESS':
            return action.response.roles;
        case 'PERSON_GET_ALL_SUCCESS':
            return action.response.roles;
        case 'ROLE_SAVE_ONE_SUCCESS':
            return [...state, action.response];
        case 'ROLE_DELETE_ONE_SUCCESS':
            return state.filter(personRole => personRole.personRoleId !== Number.parseInt(action.response, 10));
        case 'ROLE_UPDATE_ONE_SUCCESS':
            return [...state.filter(role => role.id === action.response.id), action.response];
        default:
            return state;
    }
};

export default reducer;
