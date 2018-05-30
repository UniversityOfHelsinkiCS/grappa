const reducer = (state = [], action) => {
    switch (action.type) {
        case 'PERSON_GET_MANAGERS_SUCCESS':
            return action.response.managers
        default:
            return state
    }
}

export default reducer
