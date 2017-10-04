import { CONTRACT_SAVE_SUCCESS, CONTRACT_SAVE_FAILURE, CONTRACT_SAVE_ATTEMPT } from "./ContractActions";

//const initialState = { data: [getContractNotSent().text] };

const contractSave = (state = [], action) => {
    switch (action.type) {
        case CONTRACT_SAVE_SUCCESS:
            return [...state,
            {
                id: action.type,
                text: action.text,
                completed: true
            }];
        case CONTRACT_SAVE_FAILURE:
            return [...state,
            {
                id: action.type,
                text: action.text,
                completed: true
            }];
        case CONTRACT_SAVE_ATTEMPT:
            return [...state,
            {
                id: action.type,
                text: action.text,
                completed: false
            }];
        default:
            return state;
    }
};

export default contractSave;
