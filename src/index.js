import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux'

//components
import App from './components/App';
import Agreement from './components/agreement/Agreement';
import ThesisList from './components/ThesisList';

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
                <Route exact path="/agreement" component={Agreement}/>
                <Route exact path="/theses" component={ThesisList}/>
            </Switch>
        </Router>
    </Provider>,
    document.getElementById('root')
  );

registerServiceWorker();
