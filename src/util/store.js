import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { handleRequest } from './apiConnection';

import availableRolesReducer from '../containers/role/availableRolesReducer';
import userReducer from '../containers/user/userReducer';
import agreementReducer from '../containers/agreement/agreementReducer';
import attachmentReducer from '../containers/attachment/attachmentReducer';
import councilmeetingReducer from '../containers/councilmeeting/councilmeetingReducer';
import thesisReducer from '../containers/thesis/thesisReducer';
import studyfieldReducer from '../containers/studyfield/studyfieldReducer';
import emailReducer from '../containers/email/emailReducer';
import personReducer from '../containers/person/personReducer';
import roleReducer from '../containers/role/roleReducer';
import notificationsReducer from '../containers/notifications/notificationsReducer';
import eventMessageReducer from '../containers/eventMessage/eventMessageReducer';
import inviteReducer from '../containers/invite/inviteReducer';

//TODO: Comments in english
//kaikki reducerit importataan jokaisen componentin omista kansioista, tässä kaksi esimerkkiä, miltä ne voivat näyttää
//malli myöhempää käyttöä varten grappa1.0:sta: https://github.com/UniversityOfHelsinkiCS/grappa-frontend/blob/master/src/store.js
//tutorial: https://github.com/happypoulp/redux-tutorial


const combinedReducers = combineReducers({
    agreements: agreementReducer,
    attachments: attachmentReducer,
    availableRoles: availableRolesReducer,
    user: userReducer,
    councilmeetings: councilmeetingReducer,
    roles: roleReducer,
    theses: thesisReducer,
    studyfields: studyfieldReducer,
    emails: emailReducer,
    persons: personReducer,
    notifications: notificationsReducer,
    eventMessage: eventMessageReducer,
    invite: inviteReducer
});

let store;
if (process.env.REACT_APP_DEVTOOLS === '1') {
    store = createStore(
        combinedReducers,
        compose(applyMiddleware(thunk, handleRequest),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()));
} else {
    store = createStore(
        combinedReducers,
        applyMiddleware(thunk, handleRequest));
}
export default store;
