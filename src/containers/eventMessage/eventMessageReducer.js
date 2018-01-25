const reducer = (state = {}, action) => {
    switch (true) {
        case action.type === 'ROLE_UPDATE_ONE_SUCCESS':
            return Object.assign({}, state, {
                roleUpdated: {
                    active: true,
                    type: 'success',
                    text: 'Tietojen päivitys onnistui'
                }
            });
        case action.type === 'USER_LOGOUT_SUCCESS':
            return Object.assign({}, state, {
                logout: {
                    active: true,
                    type: 'success',
                    text: 'Uloskirjautuminen onnistui'
                }
            });
        case action.type === 'INVITE_ACCEPT_THESIS_SUCCESS':
            return Object.assign({}, state, {
                inviteAuthor: {
                    active: true,
                    type: 'success',
                    text: 'Thesis linked to user'
                }
            });
        case action.type === 'COUNCILMEETING_UPDATE_ONE_SUCCESS':
            return Object.assign({}, state, {
                meeting: {
                    active: true,
                    type: 'success',
                    text: 'Councilmeeting updated.'
                }
            });
        case action.type === 'PERSON_INVITE_ONE_SUCCESS':
            return Object.assign({}, state, {
                invitePerson: {
                    active: true,
                    type: 'success',
                    text: 'Invite sent.'
                }
            });
        case action.type === 'THESIS_SAVE_ONE_SUCCESS':
            return Object.assign({}, state, {
                saveThesis: {
                    active: true,
                    type: 'success',
                    text: 'Thesis saved.'
                }
            });
        case action.type === 'THESIS_UPDATE_ONE_SUCCESS':
            return Object.assign({}, state, {
                saveThesis: {
                    active: true,
                    type: 'success',
                    text: 'Thesis saved.'
                }
            });
        case action.type.includes('_FAILURE'): {
            const message = {};
            message[action.type] = {
                active: true,
                type: 'error',
                text: action.type
            };
            return Object.assign({}, state, message)
        }
        case action.type.includes('SAVE_ONE_SUCCESS'): {
            const message = {};
            message[action.type] = {
                active: true,
                type: 'success',
                text: action.type
            };
            return Object.assign({}, state, message)
        }
        case action.type.includes('UPDATE_ONE_SUCCESS'): {
            const message = {};
            message[action.type] = {
                active: true,
                type: 'success',
                text: action.type
            };
            return Object.assign({}, state, message)
        }
        case action.type === 'EVENT_MESSAGE_CLEAR':
            return {};
        default:
            return state;
    }
};

export default reducer;
