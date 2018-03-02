import React, { Component } from 'react'
import { func } from 'prop-types'
import { NavLink, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react'

import { getPermissions } from '../util/rolePermissions'
import { login } from './User/services/userActions'
import { personType } from '../util/types'


// TODO: redux persistent storage & fetch in middleware
import { getProgrammes } from './Unit/services/programmeActions'
import { getStudyfields } from './Studyfield/services/studyfieldActions'
import { getAgreements } from './Agreement/services/agreementActions'
import { getCouncilmeetings } from './CouncilMeeting/services/councilmeetingActions'
import { getTheses } from './Thesis/services/thesisActions'
import { getPersons } from './Person/services/personActions'
import { getNotifications } from './Notification/services/notificationsAction'
import { getEmailDrafts } from './Email/services/emailActions'
import { getAxios } from '../util/apiConnection'

const logout = () => {
    getAxios()
        .get('/user/logout')
        .then((res) => {
            localStorage.clear()
            window.location = res.data.logoutUrl
        })
}

class NavBar extends Component {
    static propTypes = {
        login: func.isRequired,
        getPersons: func.isRequired,
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
        if (!this.props.user.token) {
            this.props.login()
        } else {
            this.setState({ loaded: true },
                this.getEverything(this.props.user))
        }
        if (process.env.NODE_ENV === 'development') {
            this.props.getPersons()
        }
    }

    componentWillReceiveProps(newProps) {
        if (!this.state.loaded && newProps.user.token) {
            this.setState({ loaded: true },
                this.getEverything(newProps.user))
        } else if (this.props.user.token !== newProps.user.token) {
            this.refreshLinks(newProps.user)
        }
    }

    getEverything = (user) => {
        this.props.getPersons()
        this.props.getStudyfields()
        this.props.getProgrammes()
        this.props.getAgreements()
        this.props.getCouncilmeetings()
        this.props.getTheses()
        this.props.getEmailDrafts()

        if (this.props.user.roles && this.props.user.roles.filter(role => role.role === 'admin').length > 0) {
            this.props.getNotifications()
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
                <div className="ui inverted segment">
                    <h1><Link to="/">Grappa</Link></h1>
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
    login(data) {
        dispatch(login(data))
    },
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
    }
})

const mapStateToProps = state => ({
    user: state.user
})

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)

