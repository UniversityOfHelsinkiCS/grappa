import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './index.css';
import App from './App';
import Contract from './Contract';
import ThesisList from './ThesisList';
import registerServiceWorker from './registerServiceWorker';

//ReactDOM.render(<App />, document.getElementById('root'));

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
