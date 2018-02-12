import React from 'react';
import { Route, Switch } from 'react-router-dom';

// components
import UserPage from '../containers/user/UserPage';
import AgreementPage from '../containers/agreement/AgreementPage';
import PersonRoleManagement from '../containers/person/PersonRoleManagePage';
import ThesisListPage from '../containers/thesis/ThesisListPage';
import AssesmentOfTheses from '../containers/thesis/AssesmentOfTheses';
import ThesisCreate from '../containers/thesis/ThesisCreatePage';
// import ThesisEdit from '../containers/thesis/ThesisEditPage';
import ThesisViewPage from '../containers/thesis/ThesisViewPage';
import ThesisStatistics from '../containers/thesis/ThesisStatisticsPage';
import CouncilmeetingManage from '../containers/councilmeeting/CouncilmeetingManagePage';
import CouncilmeetingView from '../containers/councilmeeting/CouncilmeetingViewPage';
import EmailDraftPage from '../containers/email/EmailDraftPage';
import NotificationsPage from '../containers/notifications/NotificationsPage';
import InvitePage from '../containers/invite/InvitePage';
import PersonRoleReviewPage from '../containers/person/PersonRoleReviewPage';

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
