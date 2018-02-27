const reducer = (state = {}, action) => {
    switch (action.type) {
        case 'USER_LOGIN_SUCCESS':
            return action.response
        case 'USER_LOGOUT_SUCCESS':
            return {}
        case 'USER_EMAIL_UPDATE_SUCCESS':
            return action.response
        default:
            return state
    }
}

export default reducer
