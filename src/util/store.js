import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { handleRequest } from './apiConnection';

import availableRolesReducer from '../component/Role/services/availableRolesReducer';
import userReducer from '../component/User/services/userReducer';
import agreementReducer from '../component/Agreement/services/agreementReducer';
import attachmentReducer from '../component/Attachment/services/attachmentReducer';
import councilmeetingReducer from '../component/CouncilMeeting/services/councilmeetingReducer';
import thesisReducer from '../component/Thesis/services/thesisReducer';
import studyfieldReducer from '../component/Studyfield/services/studyfieldReducer';
import programmeReducer from '../component/Unit/services/programmeReducer';
import emailReducer from '../component/Email/services/emailReducer';
import personReducer from '../component/Person/services/personReducer';
import roleReducer from '../component/Role/services/roleReducer';
import notificationsReducer from '../component/Notification/services/notificationsReducer';
import eventMessageReducer from '../component/EventMessage/services/eventMessageReducer';
import inviteReducer from '../component/Invite/services/inviteReducer';
import statisticsReducer from '../component/Statistics/services/statisticsReducer';

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
