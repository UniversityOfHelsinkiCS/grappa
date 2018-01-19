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
            console.log(action.response);
            return [...state.filter(personRole => !(personRole.personRoleId === parseInt(action.response.personRoleId, 10)
                && personRole.agreementId === parseInt(action.response.agreementId, 10))), action.response];
        default:
            return state;
    }
};

export default reducer;
