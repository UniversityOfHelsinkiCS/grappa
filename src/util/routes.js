import React from 'react';
import { Route, Switch } from 'react-router-dom';

//components
import App from '../components/App';
import AgreementPage from '../containers/agreement/AgreementPage';
import GraderManagement from '../containers/grader/GraderManagementPage';
import ThesisList from '../components/thesis/ThesisList';
import AssesmentOfTheses from '../containers/thesis/AssesmentOfTheses';
import ThesisManage from '../containers/thesis/ThesisManagePage';
import CouncilmeetingManage from '../containers/councilmeeting/CouncilmeetingManagePage';
import CouncilmeetingView from '../containers/councilmeeting/CouncilmeetingViewPage';
import EmailDraftPage from '../containers/email/EmailDraftPage';

export const paths = {
    home: { path: '/', component: App, navText: 'Homepage' },
    agreement: { path: '/agreement', component: AgreementPage, navText: 'Agreement' },
    theses: { path: '/theses', component: ThesisList, navText: 'Thesis List'},
    graderManagement: { path: '/graderManagement', component: GraderManagement, navText: 'Supervisor management'},
    thesis: { path: '/thesis', component: ThesisManage, navText: 'New thesis'},
    assesment: { path: '/assesment', component: AssesmentOfTheses, navText: 'Assesment of theses'},
    councilMeeting: { path: '/councilmeeting', component: CouncilmeetingView, navText: 'Next councilmeeting'},
    councilMeetings: { path: '/councilmeetings', component: CouncilmeetingManage, navText: 'Councilmeetings'},
    emailDrafts: { path: '/emaildrafts', component: EmailDraftPage, navText: 'Email drafts'}
}

export default () => {
    return (
        <Switch>
            {Object.keys(paths).map((key, index) => <Route key={index} exact path={paths[key].path} component={paths[key].component} />)}
        </Switch>
    )
}