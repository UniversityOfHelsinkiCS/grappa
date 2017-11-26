import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

//nav
import NavBar from './components/NavBar';

//util
import registerServiceWorker from './util/registerServiceWorker';
import store from "./util/store";

//media
import './media/index.css';
import './media/App.css';

//routes
import routes from './util/routes';

ReactDOM.render(
    <Provider store={store}>
        <Router basename='/v2'>
            <div className="App">
                <Route component={NavBar} />
                <div className="ui left aligned container">
                    {routes()}
                </div>
            </div>
        </Router>
    </Provider>,
    document.getElementById('root')
);

registerServiceWorker();
