const reducer = (state = [], action) => {
    switch (action.type) {
        case 'NOTIFICATIONS_GET_ALL_SUCCESS':
            return action.response
        default:
            return state
    }
}

export default reducer
