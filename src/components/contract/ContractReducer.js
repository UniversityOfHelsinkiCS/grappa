import {CONTRACT_SAVE_SUCCESS, CONTRACT_SAVE_FAILURE} from ./ContractActions

const initialState = { data: [] };

export default function(state = initialState, action) {
    switch(action.type) {
        case CONTRACT_SAVE_SUCCESS :
            return data: action.text;
        case CONTRACT_SAVE_FAILURE :
            return data: action.text;

     default:
         return state;
  }
}
