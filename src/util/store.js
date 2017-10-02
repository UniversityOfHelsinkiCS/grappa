import { createStore, combineReducers } from "redux";
import ContractReducer from "../components/contract/ContractReducer"
//kaikki reducerit importataan jokaisen componentin omista kansioista, tässä kaksi esimerkkiä, miltä ne voivat näyttää
//malli myöhempää käyttöä varten grappa1.0:sta: https://github.com/UniversityOfHelsinkiCS/grappa-frontend/blob/master/src/store.js
//tutorial: https://github.com/happypoulp/redux-tutorial

var userReducer = function (state = {}, action) {
    switch (action.type) {
        // etc.
        default:
            return state;
    }
}
var itemsReducer = function (state = [], action) {
    switch (action.type) {
        // etc.
        default:
            return state;
    }
}

const combinedReducers = combineReducers({
    user: userReducer,
    items: itemsReducer,
    ContractReducer
});

const store = createStore(combinedReducers);

export default store;
