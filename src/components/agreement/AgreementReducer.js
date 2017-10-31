import { AGREEMENT_SAVE_SUCCESS, AGREEMENT_SAVE_FAILURE, AGREEMENT_SAVE_ATTEMPT } from "./AgreementActions";

//const initialState = { data: [getAgreementNotSent().text] };

const agreementSave = (state = [], action) => {
    switch (action.type) {
        case AGREEMENT_SAVE_SUCCESS:
            return [...state,
            {
                id: action.type,
                text: action.text,
                formClass: "success",
                completed: true
            }];
        case AGREEMENT_SAVE_FAILURE:
            return [...state,
            {
                id: action.type,
                text: action.text,
                formClass: "error",
                completed: true
            }];
        case AGREEMENT_SAVE_ATTEMPT:
            return [...state,
            {
                id: action.type,
                text: action.text,
                formClass: "",
                completed: false
            }];
        default:
            return state;
    }
};

export default agreementSave;
