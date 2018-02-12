import React from 'react';
import { Route, Switch } from 'react-router-dom';

// components
import UserPage from '../component/User/UserPage';
import AgreementPage from '../component/Agreement/AgreementPage';
import PersonRoleManagement from '../component/Person/PersonRoleManagePage';
import ThesisListPage from '../component/Thesis/ThesisListPage';
import AssesmentOfTheses from '../component/Thesis/AssesmentOfTheses';
import ThesisCreate from '../component/Thesis/ThesisCreatePage';
// import ThesisEdit from '../component/Thesis/ThesisEditPage';
import ThesisViewPage from '../containers/thesis/ThesisViewPage';
import ThesisStatistics from '../component/Thesis/ThesisStatisticsPage';
import CouncilmeetingManage from '../component/CouncilMeeting/CouncilmeetingManagePage';
import CouncilmeetingView from '../component/CouncilMeeting/CouncilmeetingViewPage';
import EmailDraftPage from '../component/Email/EmailDraftPage';
import NotificationsPage from '../component/Notification/NotificationsPage';
import InvitePage from '../component/Invite/InvitePage';
import PersonRoleReviewPage from '../component/Person/PersonRoleReviewPage';

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
