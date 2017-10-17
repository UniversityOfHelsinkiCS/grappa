import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from 'redux-thunk';
import AgreementReducer from "../components/agreement/AgreementReducer";
import UserReducer from "../components/user/UserReducer";
//kaikki reducerit importataan jokaisen componentin omista kansioista, tässä kaksi esimerkkiä, miltä ne voivat näyttää
//malli myöhempää käyttöä varten grappa1.0:sta: https://github.com/UniversityOfHelsinkiCS/grappa-frontend/blob/master/src/store.js
//tutorial: https://github.com/happypoulp/redux-tutorial


const combinedReducers = combineReducers({
    agreement: AgreementReducer,
    user: UserReducer,
});

let store;
if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_NO_DEVTOOLS !== '1') {
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
