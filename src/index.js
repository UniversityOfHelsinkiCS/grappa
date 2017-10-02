import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

//components
import App from './components/App';
import Contract from './components/contract/Contract';
import ThesisList from './components/ThesisList';

//util
import registerServiceWorker from './util/registerServiceWorker';
import store from "./util/store";

//media
import './media/index.css';
import './media/App.css';

ReactDOM.render(
    <Router>
        <Switch>
            <Route exact path="/" component={App}/>
            <Route exact path="/contract" component={Contract}/>
            <Route exact path="/theses" component={ThesisList}/>
        </Switch>
    </Router>,
    document.getElementById('root')
  );

registerServiceWorker();
