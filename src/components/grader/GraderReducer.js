import { 
    ADD_GRADER_SAVE_SUCCESS, ADD_GRADER_SAVE_FAILURE, ADD_GRADER_SAVE_ATTEMPT, 
    UPDATE_GRADER_SAVE_SUCCESS, UPDATE_GRADER_SAVE_FAILURE, UPDATE_GRADER_SAVE_ATTEMPT, 
    GET_GRADERS_ATTEMPT, GET_GRADERS_SUCCESS, GET_GRADERS_FAILURE, 
} from "./ContractActions";


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
                formClass: "",
                completed: true
            }];
        case GET_GRADERS_SUCCESS:
            return [...state,
            {
                id: action.type,
                text: action.text,
                formClass: "",
                completed: true
            }];
        default:
            return state;
    }
};

export default graderSave;
