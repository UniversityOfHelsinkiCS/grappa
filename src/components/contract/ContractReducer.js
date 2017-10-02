import {CONTRACT_SAVE_SUCCESS, CONTRACT_SAVE_FAILURE} from "./ContractActions";

const initialState = { data: [] };

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
     default:
         return state;
  }
};

export default contractSave;
