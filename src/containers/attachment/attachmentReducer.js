const reducer = (state = [], action) => {
    switch (action.type) {
        case 'THESIS_SAVE_ONE_SUCCESS':
            //Saving thesis response has multiple fields.
            //Whilst saving a new thesis there shouldn't exist any old attachments
            return [...state, action.response.attachments];
        case 'AGREEMENT_SAVE_ONE_SUCCESS':
            //TODO update attachments when agreement is saved
            return state
        case 'ATTACHMENT_SAVE_ONE_SUCCESS':
            //TODO check for updates
            return [...state, action.response];
        default:
            return state;
    }
};

export default reducer;
