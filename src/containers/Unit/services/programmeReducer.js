const reducer = (state = [], action) => {
    switch (action.type) {
        case 'PROGRAMME_GET_ALL_SUCCESS':
            return action.response
        case 'PROGRAMME_SAVE_ONE_SUCCESS':
            return [...state, action.response.data]
        case 'PROGRAMME_UPDATE_ONE_SUCCESS':
            return [...state.filter(programme => programme.id === action.response.id), action.response]
        case 'PROGRAMME_DELETE_ONE_SUCCESS':
            return state.filter(programme => programme.id !== action.response.data.id)
        default:
            return state
    }
}

export default reducer
