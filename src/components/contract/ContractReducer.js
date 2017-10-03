import {CONTRACT_SAVE_SUCCESS, CONTRACT_SAVE_FAILURE,
        CONTRACT_NOT_SENT , getContractNotSent} from "./ContractActions";

const initialState = { data: [getContractNotSent().text] };

const contractSave = (state = initialState, action) => {
    switch(action.type) {
        case CONTRACT_SAVE_SUCCESS :
            return {
              data: action.text,
            };
        case CONTRACT_SAVE_FAILURE :
            return {
              data: action.text,
            };
        case CONTRACT_NOT_SENT :
            return {
              data: action.text;
            }
     default:
         return state;
  }
};

export default contractSave;
