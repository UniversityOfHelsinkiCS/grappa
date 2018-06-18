import React, { Component } from 'react'
import { func } from 'prop-types'
import { NavLink, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react'

import { getPermissions } from '../../util/rolePermissions'
import { getUser } from '../User/services/userActions'
import { personType } from '../../util/types'
import Interval from './components/Interval'

// TODO: redux persistent storage & fetch in middleware
import { getProgrammes } from '../Unit/services/programmeActions'
import { getStudyfields } from '../Studyfield/services/studyfieldActions'
import { getAgreements } from '../Agreement/services/agreementActions'
import { getCouncilmeetings } from '../CouncilMeeting/services/councilmeetingActions'
import { getTheses } from '../Thesis/services/thesisActions'
import { getPersons, getManagers } from '../Person/services/personActions'
import { getNotifications } from '../Notification/services/notificationsAction'
import { getEmailDrafts } from '../Email/services/emailActions'
import { logout } from '../../util/apiConnection'

class NavBar extends Component {
    static propTypes = {
        getUser: func.isRequired,
        getPersons: func.isRequired,
        getManagers: func.isRequired,
        getProgrammes: func.isRequired,
        getStudyfields: func.isRequired,
        getAgreements: func.isRequired,
        getCouncilmeetings: func.isRequired,
        getTheses: func.isRequired,
        getNotifications: func.isRequired,
        getEmailDrafts: func.isRequired,
        user: personType.isRequired
    }

    state = {
        links: [],
        loaded: false
    }

    componentDidMount() {
        this.props.getManagers()
        this.props.getProgrammes()
        this.props.getUser().then(() => {
            if (process.env.NODE_ENV === 'development' && this.props.user && this.props.user.roles && this.props.user.roles.find(role => role.role === 'admin')) {
                console.log('hello hello hello admin')
                this.props.getPersons()
            }
        })
        if (this.props.user) {
            this.refreshLinks(this.props.user)
        }
    }

    componentWillReceiveProps(newProps) {
        if (!this.state.loaded && newProps.user.shibbolethId) {
            this.setState({ loaded: true },
                this.getEverything(newProps.user))
        } else if (this.props.user.shibbolethId !== newProps.user.shibbolethId) {
            this.getEverything(newProps.user)
        }
    }

    getEverything = (user) => {
        // this.props.getPersons()
        this.props.getStudyfields()
        this.props.getAgreements()
        this.props.getCouncilmeetings()
        this.props.getTheses()
        this.props.getEmailDrafts()

        if (this.props.user.roles && this.props.user.roles.filter(role => role.role === 'admin').length > 0) {
            this.props.getNotifications()
            // console.log('hello hello hello admin')
            this.props.getPersons()
        }
        this.refreshLinks(user)
    }

    refreshLinks = (user) => {
        let links = []
        // Get all links that the user could require in their work.
        if (user && user.roles) {
            user.roles.forEach((roleObject) => {
                const linkPermissions = getPermissions(roleObject.role, 'nav-bar', 'show')
                links = links.concat(linkPermissions.filter(link => !links.includes(link)))
            })
        }
        // Everyone who can access Grappa is a student
        const linkPermissions = getPermissions('student', 'nav-bar', 'show')
        links = links.concat(linkPermissions.filter(link => !links.includes(link)))

        this.setState({ links })
    };

    render() {
        return (
            <div>
                <Interval function={this.props.getUser} />
                <div className="ui inverted segment">
                    <h1><Link to="/">Gradut pikaisesti pakettiin</Link></h1>
                </div>
                <div className="ui stackable secondary pointing menu">
                    {this.state.links ? this.state.links.map((elem) => {
                        // Handle special cases:
                        switch (elem.path) {
                            // Using navbar we want to display the NEXT councilmeeting, logic in component.
                            case '/councilmeeting/:id?':
                                return (
                                    <NavLink key={elem.path} to="/councilmeeting" strict className="item">
                                        {elem.navText}
                                    </NavLink>
                                )
                            default:
                                return (
                                    <NavLink key={elem.path} to={elem.path} exact className="item">
                                        {elem.navText}
                                    </NavLink>
                                )
                        }
                    }) : undefined}
                    <div className="right menu">
                        <Link to="/" className="item">{this.props.user.firstname}</Link>
                        <Button as="a" className="item" onClick={logout}>Logout</Button>
                    </div>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    getUser: () => (
        dispatch(getUser())
    ),
    getProgrammes() {
        dispatch(getProgrammes())
    },
    getStudyfields() {
        dispatch(getStudyfields())
    },
    getAgreements() {
        dispatch(getAgreements())
    },
    getCouncilmeetings() {
        dispatch(getCouncilmeetings())
    },
    getTheses() {
        dispatch(getTheses())
    },
    getPersons() {
        dispatch(getPersons())
    },
    getNotifications() {
        dispatch(getNotifications())
    },
    getEmailDrafts() {
        dispatch(getEmailDrafts())
    },
    getManagers() {
        dispatch(getManagers())
    }
})

const mapStateToProps = state => ({
    user: state.user
})

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)

