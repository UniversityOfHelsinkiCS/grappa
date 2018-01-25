const reducer = (state = false, action) => {
    switch (action.type) {
        case 'INVITE_ACCEPT_THESIS_ATTEMPT':
            return false;
        case 'INVITE_ACCEPT_THESIS_SUCCESS':
            return true;
        case 'INVITE_ACCEPT_ROLE_SUCCESS':
            return true;
        default:
            return state;
    }
};

export default reducer;
