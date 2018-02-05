export default (state = [], action) => {
    switch (action.type) {
        case 'THESIS_GET_STATS_SUCCESS':
            return action.response;
        default:
            return state;
    }
};
