import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { handleRequest } from './apiConnection'

import availableRolesReducer from '../containers/Role/services/availableRolesReducer'
import userReducer from '../containers/User/services/userReducer'
import agreementReducer from '../containers/Agreement/services/agreementReducer'
import attachmentReducer from '../containers/Attachment/services/attachmentReducer'
import councilmeetingReducer from '../containers/CouncilMeeting/services/councilmeetingReducer'
import thesisReducer from '../containers/Thesis/services/thesisReducer'
import studyfieldReducer from '../containers/Studyfield/services/studyfieldReducer'
import programmeReducer from '../containers/Unit/services/programmeReducer'
import emailReducer from '../containers/Email/services/emailReducer'
import personReducer from '../containers/Person/services/personReducer'
import roleReducer from '../containers/Role/services/roleReducer'
import notificationsReducer from '../containers/Notification/services/notificationsReducer'
import eventMessageReducer from '../containers/EventMessage/services/eventMessageReducer'
import inviteReducer from '../containers/Invite/services/inviteReducer'
import statisticsReducer from '../containers/Statistics/services/statisticsReducer'

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
})

const persistedState = localStorage.getItem('user') ? { user: JSON.parse(localStorage.getItem('user')) } : {}

// eslint-disable-next-line
const composeEnhancers = (process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
const store = createStore(
    combinedReducers,
    persistedState,
    composeEnhancers(applyMiddleware(thunk, handleRequest))
)

store.subscribe(() => {
    localStorage.setItem('user', JSON.stringify(store.getState().user))
})

export default store
