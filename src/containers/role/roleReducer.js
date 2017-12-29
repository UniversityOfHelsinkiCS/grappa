const role = {
    personWithRoleId: 1,
    personId: 1,
    studyfield: 6,
    roleName: 'supervisor',
    agreementId: 5,
    statement: 'Very good supervisor for this thesis',
}

const reducer = (state = [], action) => {
    switch (action.type) {
        case 'PERSON_GET_ALL_SUCCESS':
            return action.response.roles;
        case 'ROLE_SAVE_ONE_SUCCESS':
            return [...state, action.response];
        case 'ROLE_DELETE_ONE_SUCCESS':
            return state.filter(role => role.personId !== action.response.personId);
        case 'ROLE_UPDATE_ONE_SUCCESS':
            return [...state.filter(role => role.id === action.response.id), action.response];
        default:
            return state;
    }
};

export default reducer;
