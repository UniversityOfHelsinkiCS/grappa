import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { List, Button, Segment } from 'semantic-ui-react'

import { getUser, switchEmail, graderRoleRequest } from './services/userActions'
import { personType, programmeType } from '../../util/types'
import PersonSwitcher from '../Person/components/PersonSwitcher'
import RoleExplain from './components/RoleExplain'
import EmailSwitcher from './components/EmailSwitcher'
import ProgrammeSelect from '../Unit/components/ProgrammeSelect'
import { swapMockUser } from '../../util/apiConnection'
import { MOCK_USER } from '../../util/constants'

export class UserPage extends Component {
    state = { programmeId: undefined }

    componentDidMount() {
        document.title = 'Grappa: Main page'
    }

    getProgrammes = () => {
        if (!this.props.programmes || !this.props.user) return []
        const currentProgrammes = this.props.user.roles
            .filter(({ role }) => role === 'grader')
            .map(({ programmeId }) => programmeId)
        return this.props.programmes.filter(({ programmeId }) => !currentProgrammes.includes(programmeId))
    }

    handleRoleChange = async (shibbolethId) => {
        if (!shibbolethId) return

        await swapMockUser(shibbolethId)
        this.props.getUser()
    }

    handleResetMockUser = async () => {
        await swapMockUser(undefined)
        this.props.getUser()
    }

    handleEmailUpdate = (event) => {
        this.props.updateEmail(event.target.value)
    }

    handleUnitChange = (event) => {
        this.setState({ programmeId: event.target.value })
    }

    submitGraderRequest = async () => {
        if (this.state.programmeId) {
            // TODO: this should pop-up a notification with the response message
            this.props.graderRequest(this.state.programmeId).then(() => this.setState({ programmeId: undefined }))
        }
    }

    render() {
        const { user } = this.props
        const isAdmin = Boolean(
            ((user || {}).roles || [])
                .find(role => role.role === 'admin'))
        const unitManagers = this.props.managers.filter(manager =>
            manager.programmeId === parseInt(this.state.programmeId, 10))
        const isStaff = user && ((user.roles && user.roles.length > 0) ||
            (user.affiliation && user.affiliation.length &&
                (user.affiliation.includes('staff') || user.affiliation.includes('faculty'))))
        return (
            <div>
                <div className="ui segment">
                    <h2>{user.firstname} {user.lastname}</h2>
                    <div className="ui list">
                        <div className="item">
                            <span className="header">Student number</span> {user.studentNumber}
                        </div>
                        <div className="item">
                            <span className="header">Email</span>
                            <EmailSwitcher user={user} update={this.handleEmailUpdate} />
                        </div>
                        {user.phone && (
                            <div className="item">
                                <span className="header">Phone</span> {user.phone}
                            </div>
                        )}
                    </div>
                </div>
                {isAdmin ?
                    <div>
                        <p className="ui header">Search for people to impersonate</p>
                        <PersonSwitcher
                            onChange={this.handleRoleChange}
                        />
                    </div>
                    : null}
                {localStorage.getItem(MOCK_USER) ?
                    <Segment inverted color="red" tertiary >
                        <div>
                            You are currently impersonating
                        </div>
                        <Button className="ui button black" onClick={this.handleResetMockUser}>
                            Stop impersonating
                        </Button>
                    </Segment>
                    : null}
                {user && user.roles && user.roles.find(access => access.role.toLowerCase() === 'grader') && (
                    <Segment style={{ background: 'whitesmoke' }}>
                        When a thesis is added to Grappa the student is notified to add their thesis to Ethesis. The development of the Ethesis integration has been suspended at least until an API for automated submissions is available.
                    </Segment>
                )}
                <RoleExplain user={user} />
                {isStaff ?
                    <Segment inverted color="green" tertiary >
                        <h3>
                            Do you need grader rights? Select a Unit from the dropdown and submit a request
                            for new rights
                        </h3>
                        <ProgrammeSelect programmes={this.getProgrammes()} onChange={this.handleUnitChange} />
                        {this.state.programmeId ?
                            <Button primary onClick={this.submitGraderRequest}>Request rights
                            </Button> : undefined}
                        <h3> Below are the managers for the selected unit for any additional queries</h3>
                        <List>
                            {unitManagers.map(manager => (
                                <List.Item key={manager.personId} as="a" href={`mailto:${manager.person.email}`}>
                                    {`${manager.person.firstname} ${manager.person.lastname}`}
                                </List.Item>
                            ))}
                        </List>
                    </Segment> : undefined
                }
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    getUser() {
        dispatch(getUser())
    },
    updateEmail(useSecondaryEmail) {
        dispatch(switchEmail(useSecondaryEmail))
    },
    graderRequest: programmeId =>
        dispatch(graderRoleRequest(programmeId))
})

const mapStateToProps = state => ({
    user: state.user,
    persons: state.persons,
    managers: state.managers,
    programmes: state.programmes
})

const { arrayOf, func } = PropTypes
UserPage.propTypes = {
    user: personType.isRequired,
    persons: arrayOf(personType).isRequired,
    managers: arrayOf(personType).isRequired,
    programmes: arrayOf(programmeType).isRequired,
    getUser: func.isRequired,
    updateEmail: func.isRequired,
    graderRequest: func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPage)
