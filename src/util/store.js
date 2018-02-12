import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { handleRequest } from './apiConnection';

import availableRolesReducer from '../component/Role/availableRolesReducer';
import userReducer from '../component/User/userReducer';
import agreementReducer from '../component/Agreement/agreementReducer';
import attachmentReducer from '../component/Attachment/attachmentReducer';
import councilmeetingReducer from '../component/CouncilMeeting/councilmeetingReducer';
import thesisReducer from '../component/Thesis/thesisReducer';
import studyfieldReducer from '../component/Studyfield/studyfieldReducer';
import programmeReducer from '../component/Unit/programmeReducer';
import emailReducer from '../component/Email/emailReducer';
import personReducer from '../component/Person/personReducer';
import roleReducer from '../component/Role/roleReducer';
import notificationsReducer from '../component/Notification/notificationsReducer';
import eventMessageReducer from '../component/EventMessage/eventMessageReducer';
import inviteReducer from '../component/Invite/inviteReducer';
import statisticsReducer from '../component/Thesis/statisticsReducer';

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
    invite: inviteReducer,
    statistics: statisticsReducer
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
