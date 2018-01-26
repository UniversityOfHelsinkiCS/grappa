import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

// nav
import NavBar from './containers/NavBar';

import EventMessageContainer from './containers/eventMessage/eventMessageContainer';

// util
import store from './util/store';

// media
import './media/index.css';
import './media/App.css';

// routes
import routes from './util/routes';

ReactDOM.render(
    <Provider store={store}>
        <Router basename="/v2">
            <div className="App">
                <Route component={NavBar} />
                <div className="ui left aligned container">
                    <EventMessageContainer />
                    {routes()}
                </div>
            </div>
        </Router>
    </Provider>,
    document.getElementById('root')
);
