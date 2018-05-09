const reducer = (state = [], action) => {
    switch (action.type) {
        case 'PERSON_REQUEST_GRADER_SUCCESS':
            return action.response
        case 'PERSON_GET_GRADERS_SUCCESS':
            return action.response
        default:
            return state
    }
}

export default reducer
