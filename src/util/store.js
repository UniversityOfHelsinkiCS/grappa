import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from 'redux-thunk';
import userReducer from "../containers/user/userReducer";
import agreementReducer from "../containers/agreement/agreementReducer";
import councilmeetingReducer from "../containers/councilmeeting/councilmeetingReducer";
import supervisorReducer from "../containers/grader/supervisorReducer";
import thesisReducer from "../containers/thesis/thesisReducer";
import studyfieldReducer from "../containers/studyfield/studyfieldReducer";
import emailReducer from "../containers/email/emailReducer";
import personReducer from "../containers/person/personReducer";
import supervisorReducer2 from "../containers/supervisor/supervisorReducer";

//TODO: Comments in english
//kaikki reducerit importataan jokaisen componentin omista kansioista, tässä kaksi esimerkkiä, miltä ne voivat näyttää
//malli myöhempää käyttöä varten grappa1.0:sta: https://github.com/UniversityOfHelsinkiCS/grappa-frontend/blob/master/src/store.js
//tutorial: https://github.com/happypoulp/redux-tutorial


const combinedReducers = combineReducers({
    agreement: agreementReducer,
    user: userReducer,
    councilmeeting: councilmeetingReducer,
    supervisors: supervisorReducer,
    thesis: thesisReducer,
    studyfield: studyfieldReducer,
    email: emailReducer,
    supervisor: supervisorReducer2,
    persons: personReducer,
});

let store;
if (process.env.REACT_APP_DEVTOOLS === '1') {
    store = createStore(
        combinedReducers,
        compose(applyMiddleware(thunk),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()));
} else {
    store = createStore(
        combinedReducers,
        applyMiddleware(thunk));
}
export default store;
