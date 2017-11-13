import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from 'redux-thunk';
import agreementReducer from "../containers/agreement/agreementReducer";
import userReducer from "../components/user/UserReducer";
import councilmeetingReducer from "../containers/councilmeeting/councilmeetingReducer";
import graderReducer from "../components/grader/GraderReducer";

//TODO: Comments in english
//kaikki reducerit importataan jokaisen componentin omista kansioista, tässä kaksi esimerkkiä, miltä ne voivat näyttää
//malli myöhempää käyttöä varten grappa1.0:sta: https://github.com/UniversityOfHelsinkiCS/grappa-frontend/blob/master/src/store.js
//tutorial: https://github.com/happypoulp/redux-tutorial


const combinedReducers = combineReducers({
    agreement: agreementReducer,
    user: userReducer,
    councilmeeting: councilmeetingReducer,
    grader: graderReducer
});

let store;
if (process.env.REACT_APP_DEVTOOLS == '1') {
    store = createStore(
        combinedReducers,
        compose(applyMiddleware(thunk),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()));
} else {
    store = createStore(
        combinedReducers,
        applyMiddleware(thunk));
}
/*
const store = createStore(
    combinedReducers,
    compose(applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()));
*/
export default store;
