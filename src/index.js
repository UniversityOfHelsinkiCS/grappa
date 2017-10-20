import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

//components
import App from './components/App';
import AgreementForm from './components/agreement/AgreementForm';
import Agreement from './components/agreement/Agreement';
import GraderManagement from './containers/grader/GraderManagementPage';
import ThesisList from './components/thesis/ThesisList';
import AssesmentOfTheses from './containers/thesis/AssesmentOfTheses';

//util
import registerServiceWorker from './util/registerServiceWorker';
import store from "./util/store";

//media
import './media/index.css';
import './media/App.css';

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <Switch>
                <Route exact path="/" component={App}/>
                <Route exact path="/agreementform" component={AgreementForm}/>
                <Route exact path="/agreement" component={Agreement}/>
                <Route exact path="/theses" component={ThesisList}/>
                <Route exact path="/graderManagement" component={GraderManagement}/>
                <Route exact path="/assesment" component={AssesmentOfTheses}/>
            </Switch>
        </Router>
    </Provider>,
    document.getElementById('root')
  );

registerServiceWorker();
