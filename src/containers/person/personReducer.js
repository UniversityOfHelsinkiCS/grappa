const reducer = (state = [], action) => {
    switch (action.type) {
        case 'PERSON_GET_ALL_SUCCESS':
            return action.response.persons;
        default:
            return state;
    }
};

export default reducer;
