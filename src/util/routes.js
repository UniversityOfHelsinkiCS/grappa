import React from 'react';
import { Route, Switch } from 'react-router-dom';

// components
import UserPage from '../containers/User';
import AgreementPage from '../containers/Agreement';
import PersonRoleManagement from '../containers/Person/ManagePage';
import ThesisListPage from '../containers/Thesis/ListPage';
import AssesmentOfTheses from '../containers/Thesis/AssesmentOfTheses';
import ThesisCreate from '../containers/Thesis/CreatePage';
// import ThesisEdit from '../component/Thesis/ThesisEditPage';
import ThesisViewPage from '../containers/Thesis/ViewPage';
import ThesisStatistics from '../containers/Statistics';
import CouncilmeetingManage from '../containers/CouncilMeeting/ManagePage';
import CouncilmeetingView from '../containers/CouncilMeeting/ViewPage';
import EmailDraftPage from '../containers/Email/DraftPage';
import NotificationsPage from '../containers/Notification/NotificationsPage';
import InvitePage from '../containers/Invite';
import PersonRoleReviewPage from '../containers/Person/ReviewPage';

export const paths = {
    home: { path: '/', component: UserPage, navText: 'Homepage' },
    agreement: { path: '/agreement', component: AgreementPage, navText: 'Agreement' },
    theses: { path: '/theses', component: ThesisListPage, navText: 'Thesis list' },
    agreementPersonManagement: {
        path: '/agreementPersonManagement', component: PersonRoleReviewPage, navText: 'Grader accepting'
    },
    personRoleManagement: {
        path: '/PersonRoleManagement', component: PersonRoleManagement, navText: 'Role management'
    },
    thesisView: { path: '/thesis/:id', component: ThesisViewPage },
    thesis: { path: '/thesis', component: ThesisCreate, navText: 'New thesis' },
    assesment: { path: '/assesment', component: AssesmentOfTheses, navText: 'Assesment of theses' },
    councilMeeting: { path: '/councilmeeting/:id', component: CouncilmeetingView, navText: 'Next council meeting' },
    councilMeetings: { path: '/councilmeetings', component: CouncilmeetingManage, navText: 'Council meetings' },
    emailDrafts: { path: '/emaildrafts', component: EmailDraftPage, navText: 'Email drafts' },
    statistics: { path: '/stats', component: ThesisStatistics, navText: 'Statistics' },
    notifications: { path: '/notifications', component: NotificationsPage, navText: 'Notifications' },
    invite: { path: '/invite/:type/:token', component: InvitePage }
}

export default () => (
    <Switch>
        {Object.keys(paths).map(key => (
            <Route
                key={key}
                exact
                path={paths[key].path}
                component={paths[key].component}
            />
        ))}
    </Switch>
)
