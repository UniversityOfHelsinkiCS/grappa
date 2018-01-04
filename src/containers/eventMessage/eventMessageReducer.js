const reducer = (state = {}, action) => {
    switch (action.type) {
        case 'ROLE_UPDATE_ONE_SUCCESS':
            return Object.assign({}, state, {
                roleUpdated: {
                    active: true,
                    type: 'success',
                    text: 'Tietojen päivitys onnistui'
                }
            });
        case 'EVENT_MESSAGE_CLEAR':
            return {};
        default:
            return state;
    }
};

export default reducer;
