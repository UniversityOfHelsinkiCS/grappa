const reducer = (state = [], action) => {
    switch (action.type) {
        case "GRADER_SAVE_ONE_SUCCESS":
            console.log("SAVE_GRADER", action);
            return [...state, action.response.data];
        case "GRADER_GET_ALL_SUCCESS":
            console.log("GET_GRADERS", action)
            return action.response.data;
        case "GRADER_DELETE_ONE_SUCCESS":
            return state.filter(grader => grader.personId !== action.response.data.personId);
        //case "COUNCILMEETING_UPDATE_ONE_SUCCESS":
          //  return [...state.filter(meeting => meeting.id == action.response.id), action.response];
        //case "COUNCILMEETING_DELETE_ONE_SUCCESS":
        //    return state.filter(meeting => meeting.id !== action.response);
        default:
            return state;
    }
};

export default reducer;





/*
const graderSave = (state = [], action) => {
    switch (action.type) {
        case ADD_GRADER_SAVE_SUCCESS:
            return [...state,
            {
                id: action.type,
                text: action.text,
                formClass: "success",
                completed: true
            }];
        case ADD_GRADER_SAVE_FAILURE:
            return [...state,
            {
                id: action.type,
                text: action.text,
                formClass: "error",
                completed: true
            }];
        case ADD_GRADER_SAVE_ATTEMPT:
            return [...state,
            {
                id: action.type,
                text: action.text,
                formClass: "",
                completed: false
            }];
        case UPDATE_GRADER_SAVE_SUCCESS:
            return [...state,
            {
                id: action.type,
                text: action.text,
                formClass: "success",
                completed: true
            }];
        case UPDATE_GRADER_SAVE_FAILURE:
            return [...state,
            {
                id: action.type,
                text: action.text,
                formClass: "error",
                completed: true
            }];
        case UPDATE_GRADER_SAVE_ATTEMPT:
            return [...state,
            {
                id: action.type,
                text: action.text,
                formClass: "",
                completed: false
            }];
        case GET_GRADERS_ATTEMPT:
            return [...state,
            {
                id: action.type,
                text: action.text,
                formClass: "",
                completed: false
            }];
        case GET_GRADERS_FAILURE:
            return [...state,
            {
                id: action.type,
                text: action.text,
                formClass: "error",
                completed: true
            }];
        case GET_GRADERS_SUCCESS:
            return [...state,
            {
                id: action.type,
                text: action.text,
                formClass: "success",
                completed: true
            }];
        default:
            return state;
    }
};
*/

//export default graderSave;
