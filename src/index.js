import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

//components
import App from './components/App';
import NavBar from './components/NavBar';
import AgreementPage from './containers/agreement/AgreementPage';
import GraderManagement from './containers/grader/GraderManagementPage';
import ThesisList from './components/thesis/ThesisList';
import AssesmentOfTheses from './containers/thesis/AssesmentOfTheses';
import ThesisManage from './containers/thesis/ThesisManagePage';
import CouncilmeetingManage from './containers/councilmeeting/CouncilmeetingManagePage';
import CouncilmeetingView from './containers/councilmeeting/CouncilmeetingViewPage';
import EmailDraftPage from './containers/email/EmailDraftPage';

//util
import registerServiceWorker from './util/registerServiceWorker';
import store from "./util/store";

//media
import './media/index.css';
import './media/App.css';

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter basename='/v2'>
            <div className="App">
                <NavBar />
                <div className="ui left aligned container">
                    <Switch>
                        <Route exact path="/" component={App} />
                        <Route exact path="/agreement" component={AgreementPage} />
                        <Route exact path="/theses" component={ThesisList} />
                        <Route exact path="/gradermanagement" component={GraderManagement} />
                        <Route exact path="/thesis" component={ThesisManage} />
                        <Route exact path="/councilmeeting" component={CouncilmeetingView} />
                        <Route exact path="/councilmeetings" component={CouncilmeetingManage} />
                        <Route exact path="/emaildrafts" component={EmailDraftPage} />
                        <Route exact path="/assesment" component={AssesmentOfTheses}/>
                    </Switch>
                </div>
            </div>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);

registerServiceWorker();
