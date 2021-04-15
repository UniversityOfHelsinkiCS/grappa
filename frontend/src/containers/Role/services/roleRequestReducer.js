const reducer = (state = [], action) => {
    switch (action.type) {
        case 'ROLE_GET_REQUESTS_SUCCESS':
            return action.response
        case 'ROLE_GRANT_ONE_SUCCESS':
            return action.response
        default:
            return state
    }
}

export default reducer
