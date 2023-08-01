import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import initializeSentry from './util/sentry'

// nav
import NavBar from './containers/NavBar'

import EventMessageContainer from './containers/EventMessage'

// util
import store from './util/store'

// media
import './media/index.css'
import './media/App.css'

// routes
import routes from './util/routes'

initializeSentry()

const killServiceWorkers = () => {
    if (window.navigator && navigator.serviceWorker) {
        navigator.serviceWorker.getRegistrations()
            .then((registrations) => {
                registrations.forEach(registration => registration.unregister())
            })
    }
}

const assumeBasename = () => {
    const POSSIBLE_BASENAMES = ['grappa']
    const haystack = window.location.pathname.split('/')
    const needle = haystack.find(path => POSSIBLE_BASENAMES.includes(path))
    return needle || '/'
}

ReactDOM.render(
    <Provider store={store}>
        <Router basename={assumeBasename()}>
            <div className="App">
                <Route component={NavBar} />
                <div className="ui left aligned container" style={{ margin: '1.5%' }}>
                    <EventMessageContainer />
                    {killServiceWorkers()}
                    {routes()}
                </div>
                <h4>
                    If you are a staff member and need grader rights, please contact the Grappa manager of your unit.
                </h4>
                <h4 style={{ marginBottom: '2%' }}>
                    If you have any additional trouble, contact grp-toska@helsinki.fi
                </h4>
            </div>
        </Router>
    </Provider>,
    document.getElementById('root')
)
