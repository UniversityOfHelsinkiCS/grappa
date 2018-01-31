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
import programmeReducer from '../containers/programme/programmeReducer';
import emailReducer from '../containers/email/emailReducer';
import personReducer from '../containers/person/personReducer';
import roleReducer from '../containers/role/roleReducer';
import notificationsReducer from '../containers/notifications/notificationsReducer';
import eventMessageReducer from '../containers/eventMessage/eventMessageReducer';
import inviteReducer from '../containers/invite/inviteReducer';

const combinedReducers = combineReducers({
    agreements: agreementReducer,
    attachments: attachmentReducer,
    availableRoles: availableRolesReducer,
    user: userReducer,
    councilmeetings: councilmeetingReducer,
    roles: roleReducer,
    theses: thesisReducer,
    studyfields: studyfieldReducer,
    programmes: programmeReducer,
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
        // eslint-disable-next-line
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()));
} else {
    store = createStore(
        combinedReducers,
        applyMiddleware(thunk, handleRequest));
}
export default store;
