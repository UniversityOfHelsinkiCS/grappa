import React, { Component } from 'react'
import { connect } from 'react-redux'
import { arrayOf, func } from 'prop-types'
import { personType, roleType, programmeType, availableRoleType } from '../../util/types'

import RoleRequests from './components/RoleRequests'
import PersonSelector from './components/PersonSelector'
import PersonRoleChoose from './components/PersonRoleChoose'
import AddPerson from './components/AddPerson'
import ProgrammeRoleList from '../ProgrammeRoleList'

import { getAvailableRoles, saveRole, deleteRole, getRoleRequestsAction, grantRoleAction }
    from '../Role/services/roleActions'
import { invitePerson, getPersons } from './services/personActions'

import { makePersonRoles } from '../../selectors/personRoles'

export class PersonRoleManagePage extends Component {
    constructor(props) {
        super(props)
        this.props.getAvailableRoles()
        this.state = {
            person: undefined,
            roles: undefined
        }
    }

    componentDidMount() {
        this.props.getRoleRequests()
        this.props.getPersons()
    }

    componentWillReceiveProps(newProps) {
        const { person } = this.state

        if (person) {
            const roles = newProps.roles.filter(role => role.personId === person.personId)
                .map(role =>
                    Object.assign(
                        role,
                        { programme: newProps.programmes.find(field => field.programmeId === role.programmeId).name }
                    )
                )
            this.setState({ roles })
        }
    }

    getUserProgrammes = () => {
        const programmes = this.props.user.roles.filter(role => role.role === 'manager' || role.role === 'admin')
        const simpleProgrammes = programmes.map(programme => programme.programme)
        return [...new Set(simpleProgrammes)]
    }

    checkUserRights = () => {
        const { user, programmes } = this.props
        if (user.roles.find(role => role.role === 'admin')) {
            return programmes
        }
        const managerRoles = user.roles.filter(role => role.role === 'manager')
        const userProgrammes = managerRoles.map(role => ({ programmeId: role.programmeId, name: role.programme }))
        return userProgrammes
    }

    selectPerson = (persons) => {
        const person = persons.find(item => !this.state.person || item.personId !== this.state.person.personId)
        const roles = person ?
            this.props.roles.filter(role => role.personId === person.personId)
                .map(role =>
                    Object.assign(
                        role,
                        { programme: this.props.programmes.find(field => field.programmeId === role.programmeId).name }
                    )
                )
            : undefined
        this.setState({ person, roles })
    };

    handleAddRole = (role) => {
        if (this.state.person.personId && role.roleId && role.programmeId) {
            this.props.saveRole(Object.assign(role, { personId: this.state.person.personId }))
        }
    };

    handleRemoveRole = (role) => {
        this.props.deleteRole(role)
    };

    handleSendInvite = (data) => {
        this.props.invitePerson(data)
    };

    handleGrantRole = (e, data) => {
        this.props.grantRole(data.data)
    }

    renderManagement = () => {
        if (this.state.person) {
            return (
                <PersonRoleChoose
                    person={this.state.person}
                    roles={this.state.roles}
                    programmes={this.props.programmes}
                    availableRoles={this.props.availableRoles}
                    addRole={this.handleAddRole}
                    removeRole={this.handleRemoveRole}
                />
            )
        }
        return undefined
    }

    render() {
        if (this.props.user.roles) {
            const { persons, availableRoles, roleRequests, programmes } = this.props
            const userProgrammes = this.checkUserRights()
            const selected = this.state.person ? [this.state.person] : []
            return (
                <div>
                    <p>
                        On this page you can invite new users
                        by choosing the correct unit, role and inputting email address.
                        Grappa will then send an email to that address
                        with a link that will make them the role of your choosing.
                        <br />
                        In addition, you can choose a person using the selector.
                        When a person is chosen you can edit their roles.
                    </p>
                    <RoleRequests
                        roleRequests={roleRequests.filter(request =>
                            programmes.find(programme => programme.programmeId === request.programmeId))}
                        handleGrantRole={this.handleGrantRole}
                    />
                    <div className="ui divider" />
                    <h3>Add a person to Grappa (NOTE: person without @helsinki email cannot sign in)</h3>
                    {programmes.length > 0 && availableRoles ?
                        <AddPerson
                            programmes={userProgrammes}
                            roles={availableRoles.map(role => role.name)}
                            addNewPerson={this.handleSendInvite}
                        /> :
                        <p>loading</p>}
                    <div className="ui divider" />
                    <h3>Select a person to manage their roles</h3>
                    <PersonSelector
                        persons={persons}
                        selected={selected}
                        changeList={this.selectPerson}
                    />
                    <div className="ui divider" />
                    {this.renderManagement()}
                    <div className="ui divider" />
                    <ProgrammeRoleList
                        userProgrammes={this.getUserProgrammes()}
                        persons={persons}
                    />
                    <div className="ui divider" />
                </div>
            )
        }
        return (<p>Coming right back</p>)
    }
}

const mapDispatchToProps = dispatch => ({
    getAvailableRoles() {
        dispatch(getAvailableRoles())
    },
    saveRole(role) {
        dispatch(saveRole(role))
    },
    deleteRole(role) {
        dispatch(deleteRole(role))
    },
    invitePerson(invite) {
        dispatch(invitePerson(invite))
    },
    getRoleRequests: () => (
        dispatch(getRoleRequestsAction())
    ),
    grantRole: data => (
        dispatch(grantRoleAction(data))
    ),
    getPersons: () => (
        dispatch(getPersons())
    )
})

const personRoles = makePersonRoles()

const mapStateToProps = state => ({
    programmes: state.programmes,
    persons: state.persons,
    roles: personRoles(state),
    availableRoles: state.availableRoles,
    roleRequests: state.roleRequests,
    user: state.user
})

PersonRoleManagePage.propTypes = {
    programmes: arrayOf(programmeType).isRequired,
    persons: arrayOf(personType).isRequired,
    roles: arrayOf(roleType).isRequired,
    availableRoles: arrayOf(availableRoleType).isRequired,
    getAvailableRoles: func.isRequired,
    saveRole: func.isRequired,
    deleteRole: func.isRequired,
    invitePerson: func.isRequired,
    getRoleRequests: func.isRequired,
    grantRole: func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonRoleManagePage)
