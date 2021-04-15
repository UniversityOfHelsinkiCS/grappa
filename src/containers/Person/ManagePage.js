import React, { Component } from 'react'
import { connect } from 'react-redux'
import { arrayOf, func } from 'prop-types'
import { Dropdown } from 'semantic-ui-react'

import { personType, programmeType, availableRoleType } from '../../util/types'

import RoleRequests from './components/RoleRequests'
import PersonRoleChoose from './components/PersonRoleChoose'
import AddPerson from './components/AddPerson'
import ProgrammeRoleList from '../ProgrammeRoleList'

import { getAvailableRoles, saveRole, deleteRole, getRoleRequestsAction, grantRoleAction }
    from '../Role/services/roleActions'
import { invitePerson, getPersons } from './services/personActions'

export class PersonRoleManagePage extends Component {
    constructor(props) {
        super(props)
        this.props.getAvailableRoles()
        this.state = {
            person: undefined
        }
    }

    componentDidMount() {
        this.props.getRoleRequests()
        this.props.getPersons()
    }

    componentDidUpdate() {
        const { person } = this.state
        if (person) {
            const newPerson = this.props.persons.find(newP => newP.personId === person.personId)
            if (!newPerson.roles.every(role => person.roles.includes(role)))
                this.setState({ person: newPerson })
        }
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

    selectPerson = (e, data) => {
        const { persons } = this.props
        const selected = data.value
        const person = persons.find(item => item.personId === selected)
        this.setState({ person })
    }

    handleAddRole = (role) => {
        if (this.state.person.personId && role.roleId && role.programmeId) {
            this.props.saveRole(Object.assign(role, { personId: this.state.person.personId }))
        }
    }

    handleRemoveRole = (role) => {
        this.props.deleteRole(role)
    }

    handleSendInvite = (data) => {
        this.props.invitePerson(data)
    }

    handleGrantRole = (e, data) => {
        this.props.grantRole(data.data).then(() => this.props.getPersons())
    }

    renderManagement = (userProgrammes) => {
        if (this.state.person) {
            return (
                <PersonRoleChoose
                    person={this.state.person}
                    programmes={userProgrammes}
                    availableRoles={this.props.availableRoles}
                    addRole={this.handleAddRole}
                    removeRole={this.handleRemoveRole}
                />
            )
        }
        return undefined
    }

    renderPersonSelector = (persons, selected, changeList) => {
        const personList = persons.map((person) => {
            const { personId, firstname, lastname, email } = person
            return {
                key: personId,
                value: personId,
                text: `${firstname} ${lastname} ${email}`
            }
        })
        return (<Dropdown
            placeholder="Select person"
            fluid
            search
            selection
            options={personList}
            onChange={changeList}
            value={selected}
        />)
    }

    render() {
        if (this.props.user.roles) {
            const { persons, availableRoles, roleRequests, programmes } = this.props
            const userProgrammes = this.checkUserRights()
            const selected = this.state.person ? this.state.person.personId : null
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
                    {this.renderPersonSelector(persons, selected, this.selectPerson)}
                    <div className="ui divider" />
                    {this.renderManagement(userProgrammes)}
                    <div className="ui divider" />
                    <ProgrammeRoleList
                        userProgrammes={userProgrammes.map(programme => programme.name)}
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
    saveRole: role => (
        dispatch(saveRole(role))
    ),
    deleteRole: role => (
        dispatch(deleteRole(role))
    ),
    invitePerson: invite => (
        dispatch(invitePerson(invite))
    ),
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

const mapStateToProps = state => ({
    programmes: state.programmes,
    persons: state.persons,
    availableRoles: state.availableRoles,
    roleRequests: state.roleRequests,
    user: state.user
})

PersonRoleManagePage.propTypes = {
    programmes: arrayOf(programmeType).isRequired,
    persons: arrayOf(personType).isRequired,
    availableRoles: arrayOf(availableRoleType).isRequired,
    getAvailableRoles: func.isRequired,
    saveRole: func.isRequired,
    deleteRole: func.isRequired,
    invitePerson: func.isRequired,
    getRoleRequests: func.isRequired,
    grantRole: func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonRoleManagePage)
