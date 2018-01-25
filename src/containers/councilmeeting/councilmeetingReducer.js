const reducer = (state = [], action) => {
    switch (action.type) {
        case 'COUNCILMEETING_GET_ALL_SUCCESS':
            return action.response;
        case 'COUNCILMEETING_SAVE_ONE_SUCCESS':
            return [...state, action.response];
        case 'COUNCILMEETING_UPDATE_ONE_SUCCESS':
            return [...state.filter(meeting => meeting.councilmeetingId !== action.response.councilmeetingId), action.response];
        case 'COUNCILMEETING_DELETE_ONE_SUCCESS':
            return state.filter(meeting => meeting.councilmeetingId !== Number(action.response));
        default:
            return state;
    }
};

export default reducer;
