import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

// nav
import NavBar from './containers/NavBar';

import EventMessageContainer from './containers/EventMessage';

// util
import store from './util/store';

// media
import './media/index.css';
import './media/App.css';

// routes
import routes from './util/routes';

const killServiceWorkers = () => {
    if (window.navigator && navigator.serviceWorker) {
        navigator.serviceWorker.getRegistrations()
            .then((registrations) => {
                registrations.forEach(registration => registration.unregister())
            });
    }
}

ReactDOM.render(
    <Provider store={store}>
        <Router basename="/v2">
            <div className="App">
                <Route component={NavBar} />
                <div className="ui left aligned container" style={{ margin: '1.5%' }}>
                    <EventMessageContainer />
                    {killServiceWorkers()}
                    {routes()}
                </div>
                <h4 style={{ marginBottom: '2%' }}>If you have trouble, contact grp-toska@helsinki.fi</h4>
            </div>
        </Router>
    </Provider>,
    document.getElementById('root')
);
