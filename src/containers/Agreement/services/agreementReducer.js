const reducer = (state = [], action) => {
    switch (action.type) {
        case 'AGREEMENT_GET_ALL_SUCCESS':
            // Response contains agreements and attachments.
            return action.response.agreements
        case 'AGREEMENT_GET_ONE_SUCCESS':
            return [...state, action.response]
        case 'AGREEMENT_UPDATE_ONE_SUCCESS':
            return [...state.filter(agreement => agreement.id !== action.response.id), action.response]
        case 'AGREEMENT_SAVE_ONE_SUCCESS':
            return [...state, action.response]
        case 'AGREEMENT_DELETE_ONE_SUCCESS':
            return state.filter(agreement => agreement.id !== action.response)
        case 'THESIS_SAVE_ONE_SUCCESS':
            // Saving thesis response has multiple fields.
            return [...state, action.response.agreement]
        case 'THESIS_UPDATE_ONE_SUCCESS':
            return [
                ...state.filter(agreement => agreement.agreementId !== action.response.agreements[0].agreementId),
                action.response.agreements[0]
            ]
        default:
            return state
    }
}

export default reducer
