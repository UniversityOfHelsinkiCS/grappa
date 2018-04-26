import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { List, Button, Segment } from 'semantic-ui-react'

import { login, switchEmail, graderRoleRequest } from './services/userActions'
import { personType, programmeType } from '../../util/types'
import PersonSwitcher from '../Person/components/PersonSwitcher'
import RoleExplain from './components/RoleExplain'
import EmailSwitcher from './components/EmailSwitcher'
import ProgrammeSelect from '../Unit/components/ProgrammeSelect'

export class UserPage extends Component {
    state = { programmeId: undefined }

    componentDidMount() {
        document.title = 'Grappa: Main page'
    }

    handleRoleChange = (event) => {
        if (!event.target.value) return
        const shibbolethId = event.target.value
        this.props.login(shibbolethId)
    }

    handleEmailUpdate = (event) => {
        this.props.updateEmail(event.target.value)
    }

    handleUnitChange = (event) => {
        this.setState({ programmeId: event.target.value })
    }

    submitGraderRequest = () => {
        if (this.state.programmeId) {
            this.props.graderRequest(this.state.programmeId)
            console.log('submitting grader request! ', this.state.programmeId)
        }
    }

    render() {
        const unitManagers = this.props.managers.filter(manager => manager.programmeId === parseInt(this.state.programmeId, 10))
        return (
            <div>
                <div className="ui segment">
                    <h2>{this.props.user.firstname} {this.props.user.lastname}</h2>
                    <div className="ui list">
                        <div className="item">
                            <span className="header">Student number</span> {this.props.user.studentNumber}
                        </div>
                        <div className="item">
                            <span className="header">Email</span>
                            <EmailSwitcher user={this.props.user} update={this.handleEmailUpdate} />
                        </div>
                        <div className="item">
                            <span className="header">Phone</span> {this.props.user.phone}
                        </div>
                    </div>
                </div>
                {process.env.NODE_ENV !== 'production' ?
                    <PersonSwitcher
                        persons={this.props.persons}
                        onChange={this.handleRoleChange}
                    />
                    : null}
                <RoleExplain user={this.props.user} />
                <Segment inverted color="green" tertiary >
                    <h3>Do you need grader rights? Select a Unit from the dropdown and submit a request for new rights </h3>
                    <ProgrammeSelect programmes={this.props.programmes} onChange={this.handleUnitChange} />
                    {this.state.programmeId ? <Button primary onClick={this.submitGraderRequest}>Request rights</Button> : undefined}
                    <h3> Below are the managers for the selected unit for any additional queries</h3>
                    <List>
                        {unitManagers.map(manager => <List.Item as="a" href={`mailto:${manager.person.email}`}>{`${manager.person.firstname} ${manager.person.lastname}`}</List.Item>)}
                    </List>
                </Segment>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    login(data) {
        dispatch(login(data))
    },
    updateEmail(useSecondaryEmail) {
        dispatch(switchEmail(useSecondaryEmail))
    },
    graderRequest(programmeId) {
        dispatch(graderRoleRequest(programmeId))
    }
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
    login: func.isRequired,
    updateEmail: func.isRequired,
    graderRequest: func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPage)
