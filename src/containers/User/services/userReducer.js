const reducer = (state = {}, action) => {
    switch (action.type) {
        case 'USER_LOGIN_SUCCESS':
            return action.response
        case 'USER_EMAIL_UPDATE_SUCCESS':
            return action.response
        case 'USER_GRADER_REQUEST_SUCCESS':
            return state
        default:
            return state
    }
}

export default reducer
